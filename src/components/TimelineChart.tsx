import { useMemo } from 'react';
import type { AggregatedSlot } from '../lib/aggregation';
import { useChartData } from '../hooks/useChartData';



type MetricType = 'clicks' | 'revenue';
type MetricKey = 'totalClicks' | 'totalRevenue';

interface Props {
  data: AggregatedSlot[];
  metric: MetricType;
  onMetricChange: (m: MetricType) => void;
}

const getTickValues = (min: number, max: number, count: number): number[] => {
  if (count < 1) return [];
  const range = max - min;
  return Array.from({ length: count + 1 }, (_, i) => min + (i * range) / count);
};


export function TimelineChart({ data, metric, onMetricChange }: Props) {

  const metricKey: MetricKey = metric === 'clicks' ? 'totalClicks' : 'totalRevenue';


  const { path, points, minY, maxY, minX, maxX, dims } = useChartData(data, metricKey);

  const { w, h, m, innerH } = dims;

 


  const yTicks = 4;
  const yTickValues = getTickValues(minY, maxY, yTicks);

  
  const xTickCount = Math.min(6, data.length);
  const xTickIndexes = useMemo(() => {
    if (data.length === 0) return [];
    const step = data.length > 1 ? (data.length - 1) / (xTickCount - 1) : 0;
    return Array.from({ length: xTickCount }, (_, i) => Math.round(i * step));
  }, [data.length, xTickCount]);


  return (
    <div className="w-full">
  
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">
          Timeline (Showing **{metric === 'clicks' ? 'Clicks' : 'Revenue'}**)
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
      
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64 bg-white rounded-lg shadow border">
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
              <text x={x} y={h - m.bottom + 16} textAnchor="middle" className="fill-gray-500 text-[10px]">
                {d.label}
              </text>
            </g>
          );
        })}

 
        <path d={path} fill="none" stroke="#2563eb" strokeWidth={2} />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#1d4ed8" />
        ))}
      </svg>
    </div>
  );
}