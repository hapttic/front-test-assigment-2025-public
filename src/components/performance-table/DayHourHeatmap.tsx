import React, { useMemo, useState } from 'react';
import type { AggregatedPoint } from '../../hooks/useCampaignAnalytics';
import { formatNumber } from '../../utils/formatters';
import type { MetricType } from '../../types';

interface HourlyHeatmapProps { data: AggregatedPoint[]; metricKey: MetricType; }

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data, metricKey }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getTheme = () => {
    switch(metricKey) {
      case 'revenue': return { main: '#10b981' }; case 'clicks': return { main: '#3b82f6' }; case 'impressions': return { main: '#8b5cf6' };
      default: return { main: '#3b82f6' };
    }
  };
  const theme = getTheme();

  const { grid, maxVal, cols } = useMemo(() => {
    if (data.length === 0) return { grid: [], maxVal: 0, cols: [], dates: [] };
    const uniqueDates = Array.from(new Set(data.map(d => {
      const date = new Date(d.timestamp); return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }))).sort((a, b) => a - b);
    const dateToIndex = new Map(uniqueDates.map((ts, i) => [ts, i]));
    const gridData = Array(24).fill(0).map(() => Array(uniqueDates.length).fill(0));
    let max = 0;

    data.forEach(point => {
      const d = new Date(point.timestamp);
      const dayStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const colIndex = dateToIndex.get(dayStartTs);
      const hour = d.getHours();
      if (colIndex !== undefined) {
        const val = Number(point[metricKey] || 0);
        gridData[hour][colIndex] += val;
        if (gridData[hour][colIndex] > max) max = gridData[hour][colIndex];
      }
    });
    const colHeaders = uniqueDates.map(ts => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    return { grid: gridData, maxVal: max, cols: colHeaders };
  }, [data, metricKey]);

  const cellWidth = 30; const cellHeight = 16; const yLabelWidth = 50; const xLabelHeight = 30;
  const width = yLabelWidth + (cellWidth * cols.length);
  const height = xLabelHeight + (cellHeight * 24);
  const [hoveredData, setHoveredData] = useState<{x: number, y: number, val: number, hour: number, day: string} | null>(null);

  if (maxVal === 0) return <div className="h-full flex items-center justify-center text-slate-400">No data available</div>;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="grow overflow-auto relative custom-scrollbar">
        <svg width={Math.max(width, 100)} height={height} className="block my-2">
          {hours.map((hour) => ( <line key={`line-${hour}`} x1={yLabelWidth} y1={hour * cellHeight + cellHeight / 2} x2={width} y2={hour * cellHeight + cellHeight / 2} stroke="#f1f5f9" strokeWidth="1" /> ))}
          {hours.map((hour) => ( (hour % 3 === 0) && ( <text key={`label-${hour}`} x={yLabelWidth - 10} y={hour * cellHeight + cellHeight / 2 + 4} textAnchor="end" fontSize="11" fill="#94a3b8" className="font-medium"> {hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`} </text> ) ))}
          {grid.map((row, hourIndex) => (
            row.map((val, dayIndex) => {
              if (val === 0) return null;
              const percentage = val / maxVal;
              const radius = Math.max(1.5, Math.sqrt(percentage) * 7); 
              const cx = yLabelWidth + dayIndex * cellWidth + cellWidth / 2; const cy = hourIndex * cellHeight + cellHeight / 2;
              return ( <circle key={`${dayIndex}-${hourIndex}`} cx={cx} cy={cy} r={radius} fill={theme.main} opacity={0.7} className="transition-all duration-200 hover:opacity-100 hover:r-[8px] cursor-pointer" onMouseEnter={() => setHoveredData({ x: cx, y: cy, val, hour: hourIndex, day: cols[dayIndex] })} onMouseLeave={() => setHoveredData(null)} /> );
            })
          ))}
          {cols.map((col, i) => { if (cols.length > 20 && i % 3 !== 0) return null; return ( <text key={`col-${i}`} x={yLabelWidth + i * cellWidth + cellWidth / 2} y={height - 5} textAnchor="middle" fontSize="10" fill="#64748b"> {col} </text> ) })}
          {hoveredData && ( <g transform={`translate(${hoveredData.x}, ${hoveredData.y - 12})`} style={{ pointerEvents: 'none' }}> <rect x="-55" y="-45" width="110" height="40" rx="6" fill="#1e293b" className="shadow-xl" /> <path d="M -5 -5 L 0 2 L 5 -5 Z" fill="#1e293b" /> <text x="0" y="-28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold"> {metricKey === 'revenue' ? '$' : ''}{formatNumber(hoveredData.val)} </text> <text x="0" y="-14" textAnchor="middle" fill="#cbd5e1" fontSize="9"> {hoveredData.day} • {hoveredData.hour}:00 </text> </g> )}
        </svg>
      </div>
    </div>
  );
};