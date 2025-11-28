import React, { useMemo } from 'react';
import { formatNumber } from '../../utils/formatters';
import type { AggregatedPoint } from '../../hooks/useCampaignAnalytics';
import type { MetricType, TimeInterval } from '../../types';

interface TimelineChartProps {
  data: AggregatedPoint[]; 
  metricKey: MetricType;
  aggregation: TimeInterval;
}


const height = 300;
const width = 800; 
const padding = { top: 20, right: 20, bottom: 40, left: 60 };

export const TimelineChart: React.FC<TimelineChartProps> = ({ data, metricKey, aggregation }) => {
  
  const getColor = () => {
    switch(metricKey) {
      case 'revenue': return '#10b981'; 
      case 'clicks': return '#3b82f6';  
      case 'impressions': return '#8b5cf6';
      default: return '#3b82f6';
    }
  };
  const color = getColor();

  const getTooltipDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (aggregation === 'hourly') {
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSmoothPath = (points: {x: number, y: number}[], bottomY: number) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    
    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const tension = 0.2;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      let cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      let cp2y = p2.y - (p3.y - p1.y) * tension;

      if (cp1y > bottomY) cp1y = bottomY;
      if (cp2y > bottomY) cp2y = bottomY;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const { pathD, areaD, points, maxVal, xTicks } = useMemo(() => {
    if (data.length === 0) return { pathD: '', areaD: '', points: [], maxVal: 0, xTicks: [] };

    // Compute scales and points
    const max = Math.max(...data.map(d => Number(d[metricKey]))) * 1.1 || 100;
    const minTime = data[0].timestamp;
    const maxTime = data[data.length - 1].timestamp;
    const timeRange = maxTime - minTime || 1;
    
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const computedPoints = data.map(d => ({
      x: padding.left + ((d.timestamp - minTime) / timeRange) * chartW,
      y: (height - padding.bottom) - (Number(d[metricKey]) / max) * chartH,
      value: d[metricKey],
      label: d.dateKey,
      timestamp: d.timestamp
    }));

    const curvePath = getSmoothPath(computedPoints, height - padding.bottom);
    const area = `${curvePath} L ${computedPoints[computedPoints.length-1].x},${height - padding.bottom} L ${computedPoints[0].x},${height - padding.bottom} Z`;

    const tickCount = 6;
    const step = Math.ceil(data.length / (tickCount - 1));
    const xTicks = data.filter((_, i) => i % step === 0 || i === data.length - 1).map(d => ({
      x: padding.left + ((d.timestamp - minTime) / timeRange) * chartW,
      label: d.dateKey
    }));

    return { pathD: curvePath, areaD: area, points: computedPoints, maxVal: max, xTicks };
  }, [data, metricKey]); 

  if (data.length === 0) return <div className="h-[300px] flex items-center justify-center text-slate-400">No data available in selected range</div>;

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`gradient-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map(tick => {
          const y = (height - padding.bottom) - (tick * (height - padding.top - padding.bottom));
          const val = Math.round(maxVal * tick);
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
                {metricKey === 'revenue' && tick > 0 ? '$' : ''}{formatNumber(val)}
              </text>
            </g>
          );
        })}

        {xTicks.map((tick, i) => (
          <g key={i}>
            <text x={tick.x} y={height - padding.bottom + 20} textAnchor="middle" fontSize="11" fill="#64748b">
              {tick.label}
            </text>
          </g>
        ))}

        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#cbd5e1" />

        <path d={areaD} fill={`url(#gradient-${metricKey})`} stroke="none" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
          
            <circle 
                cx={p.x} 
                cy={p.y} 
                r="3" 
                fill="white" 
                stroke={color} 
                strokeWidth="2.5" 
                className="transition-all duration-200 group-hover:r-6 shadow-sm"
            />
            
            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 duration-200">
              <rect x={p.x - 60} y={p.y - 70} width="120" height="55" rx="8" fill="#1e293b" stroke="white" strokeWidth="2" className="shadow-xl" />
              
              <text x={p.x} y={p.y - 45} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
                {metricKey === 'revenue' ? '$' : ''}{formatNumber(Number(p.value))}
              </text>
              
              <text x={p.x} y={p.y - 28} textAnchor="middle" fill="#94a3b8" fontSize="11">
                {getTooltipDate(p.timestamp)}
              </text>
              
              <path d={`M ${p.x - 6} ${p.y - 15} L ${p.x + 6} ${p.y - 15} L ${p.x} ${p.y - 9} Z`} fill="#1e293b" stroke="white" strokeWidth="1" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
};