import React, { useMemo } from 'react';
import type { MetricType } from '../../types';
import { formatNumber } from '../../utils/formatters';
import type { AggregatedPoint } from '../../hooks/useCampaignAnalytics';

interface HourlyHeatmapProps {
    data: AggregatedPoint[]; 
  metricKey: MetricType;
}

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data, metricKey }) => {
  const hours = [
    '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
    '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
  ];

  const { grid, maxVal, cols } = useMemo(() => {
    if (data.length === 0) return { grid: [], maxVal: 0, cols: [] };

    const uniqueDateStrings = Array.from(new Set(data.map(d => {
      const date = new Date(d.timestamp);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    })));

    uniqueDateStrings.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const colHeaders = uniqueDateStrings.map(d => 
      new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    const dateToIndex = new Map(uniqueDateStrings.map((d, i) => [d, i]));
    const gridData = Array(24).fill(0).map(() => Array(uniqueDateStrings.length).fill(0));
    let max = 0;

    data.forEach(point => {
      const d = new Date(point.timestamp);
      const dateKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const colIndex = dateToIndex.get(dateKey);
      const hour = d.getHours();
      
      if (colIndex !== undefined) {
        gridData[hour][colIndex] += point[metricKey];
        if (gridData[hour][colIndex] > max) max = gridData[hour][colIndex];
      }
    });

    return { grid: gridData, maxVal: max, cols: colHeaders };
  }, [data, metricKey]);

  const cellSize = 40;
  const gap = 4;
  const xLabelsHeight = 40;
  const yLabelsWidth = 50;
  const width = yLabelsWidth + (cellSize + gap) * cols.length;
  const height = xLabelsHeight + (cellSize + gap) * 24;

  if (maxVal === 0) return <div className="h-[500px] flex items-center justify-center text-slate-400">No data available</div>;

  return (
    <div className="w-full overflow-x-auto flex justify-start pb-4">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          {hours.map((hour, i) => (
            <text 
              key={hour} 
              x={yLabelsWidth - 10} 
              y={i * (cellSize + gap) + cellSize / 1.5} 
              textAnchor="end" 
              fontSize="11" 
              fill="#64748b"
            >
              {hour}
            </text>
          ))}

          {grid.map((row, hourIndex) => (
            row.map((val, dayIndex) => {
              const opacity = val / maxVal;
              const fillOpacity = val > 0 ? Math.max(0.1, opacity) : 0.02;
              
              return (
                <g key={`${dayIndex}-${hourIndex}`} className="group">
                  <rect
                    x={yLabelsWidth + dayIndex * (cellSize + gap)}
                    y={hourIndex * (cellSize + gap)}
                    width={cellSize}
                    height={cellSize}
                    rx={6}
                    fill="#8b5cf6"
                    fillOpacity={fillOpacity}
                    className="transition-all duration-300 hover:stroke-indigo-600 hover:stroke-2 cursor-pointer"
                  />
                  <title>
                    {cols[dayIndex]}, {hours[hourIndex]}: {metricKey === 'revenue' ? '$' : ''}{formatNumber(val)}
                  </title>
                  {val > 0 && (
                      <text
                        x={yLabelsWidth + dayIndex * (cellSize + gap) + cellSize / 2}
                        y={hourIndex * (cellSize + gap) + cellSize / 1.5 + 1}
                        textAnchor="middle"
                        fontSize="9"
                        fill={fillOpacity > 0.5 ? 'white' : '#4c1d95'}
                        pointerEvents="none"
                        fontWeight="500"
                      >
                        {val > 999 ? (val/1000).toFixed(1) + 'k' : Math.round(val)}
                      </text>
                  )}
                </g>
              );
            })
          ))}

          {cols.map((col, i) => (
            <text 
              key={col + i} 
              x={yLabelsWidth + i * (cellSize + gap) + cellSize / 2} 
              y={height} 
              textAnchor="middle" 
              fontSize="11" 
              fontWeight="500"
              fill="#334155"
            >
              {col}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};