import { useMemo, useState } from 'react';
import type { AggregatedSlot } from '../lib/aggregation';
import { useChartData } from '../hooks/useChartData';
import type { MetricType, MetricKey } from '../types/chart';
import { getTickValues } from '../utils/chart';
import { Y_TICKS_COUNT, X_TICKS_MAX_COUNT } from '../constants/chart';

interface Props {
  data: AggregatedSlot[];
  metric: MetricType;
  onMetricChange: (m: MetricType) => void;
}

export function TimelineChart({ data, metric, onMetricChange }: Props) {
  const metricKey: MetricKey = metric === 'clicks' ? 'totalClicks' : 'totalRevenue';
  const { path, points, minY, maxY, minX, maxX, dims } = useChartData(data, metricKey);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { w, h, m, innerH } = dims;

  const yTickValues = getTickValues(minY, maxY, Y_TICKS_COUNT);
  const xTickCount = Math.min(X_TICKS_MAX_COUNT, data.length);
  const xTickIndexes = useMemo(() => {
    if (data.length === 0) return [];
    const step = data.length > 1 ? (data.length - 1) / (xTickCount - 1) : 0;
    return Array.from({ length: xTickCount }, (_, i) => Math.round(i * step));
  }, [data.length, xTickCount]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">
          Timeline ({metric === 'clicks' ? 'Clicks' : 'Revenue'})
        </h3>
        <div className="flex items-center gap-2">
          <label htmlFor="metric-select" className="text-sm text-gray-700">View By:</label>
          <select
            id="metric-select"
            className="border rounded-md px-2 py-1 text-sm bg-white"
            value={metric}
            onChange={(e) => onMetricChange(e.target.value as MetricType)}
          >
            <option value="clicks">Clicks</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="w-full h-64 bg-white rounded-lg shadow border flex items-center justify-center text-gray-500">No data to display</div>
      ) : (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-64 bg-white rounded-lg shadow border"
        onMouseLeave={() => setHoverIndex(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const viewX = ((e.clientX - rect.left) / rect.width) * w;
          const innerX = Math.min(Math.max(viewX - m.left, 0), dims.innerW);
          const ratio = dims.innerW === 0 ? 0 : innerX / dims.innerW;
          const targetTs = minX + ratio * (maxX - minX);
          let nearest = 0;
          let best = Infinity;
          for (let i = 0; i < data.length; i++) {
            const dt = Math.abs(data[i].startUTC - targetTs);
            if (dt < best) { best = dt; nearest = i; }
          }
          setHoverIndex(nearest);
        }}
      >
        <line x1={m.left} y1={m.top} x2={m.left} y2={h - m.bottom} stroke="#e5e7eb" />
        <line x1={m.left} y1={h - m.bottom} x2={w - m.right} y2={h - m.bottom} stroke="#e5e7eb" />

        {yTickValues.map((v, i) => {
          const ratio = (v - minY) / (maxY - minY);
          const y = m.top + (1 - ratio) * innerH;

          return (
            <g key={i}>
              <line x1={m.left} y1={y} x2={w - m.right} y2={y} stroke="#f3f4f6" />
              <text x={m.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-gray-500 text-[10px]">
                {metric === 'clicks' ? Math.round(v) : v.toFixed(2)}
              </text>
            </g>
          );
        })}

        {xTickIndexes.map((idx, i) => {
          const d = data[idx];
          const ratio = (d.startUTC - minX) / (maxX - minX || 1);
          const x = m.left + ratio * dims.innerW;

          return (
            <g key={i}>
              <line x1={x} y1={h - m.bottom} x2={x} y2={m.top} stroke="#f3f4f6" />
              <text x={x} y={h - m.bottom + 16} textAnchor="middle" className="fill-gray-500 text-[10px]" transform={`rotate(-35, ${x}, ${h - m.bottom + 16})`}>
                {d.label}
              </text>
            </g>
          );
        })}

        {points.length > 1 && (
          <path
            d={`M ${points[0].x} ${points[0].y} ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${m.top + innerH} L ${points[0].x} ${m.top + innerH} Z`}
            fill="#93c5fd"
            opacity={0.25}
          />
        )}

        <path d={path} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hoverIndex === i ? 4 : 2.5} fill="#1d4ed8" />
        ))}

        {hoverIndex !== null && points[hoverIndex] && (
          <g>
            <line x1={points[hoverIndex].x} y1={m.top} x2={points[hoverIndex].x} y2={h - m.bottom} stroke="#d1d5db" strokeDasharray="4 4" />
            <g transform={`translate(${points[hoverIndex].x + 8}, ${points[hoverIndex].y - 24})`}>
              <rect width="140" height="40" rx="6" fill="#111827" opacity="0.9" />
              <text x="8" y="16" className="fill-white text-[10px]">{data[hoverIndex].label}</text>
              <text x="8" y="30" className="fill-white text-[10px]">{metric === 'clicks' ? `${data[hoverIndex].totalClicks} clicks` : `$${data[hoverIndex].totalRevenue.toFixed(2)}`}</text>
            </g>
          </g>
        )}
      </svg>
      )}
    </div>
  );
}