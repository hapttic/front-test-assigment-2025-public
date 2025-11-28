import React, { useMemo, useState, useEffect } from 'react';
import type { AggregatedPoint } from '../../hooks/useCampaignAnalytics';
import { formatNumber } from '../../utils/formatters';
import type { MetricType } from '../../types';
import { Calendar as CalendarIcon } from 'lucide-react';

interface HourlyHeatmapProps {
  data: AggregatedPoint[];
  metricKey: MetricType;
}

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data, metricKey }) => {
  
  const initialDate = useMemo(() => {
    if (data.length > 0) return new Date(data[0].timestamp).toISOString().split('T')[0];
    return new Date().toISOString().split('T')[0];
  }, [data]);

  const [selectedDay, setSelectedDay] = useState(initialDate);

  useEffect(() => {
    if (data.length > 0) {
        const first = new Date(data[0].timestamp).getTime();
        const last = new Date(data[data.length-1].timestamp).getTime();
        const current = new Date(selectedDay).getTime();
        if (current < first || current > last) {
             const timeoutId = window.setTimeout(() => {
               setSelectedDay(new Date(data[0].timestamp).toISOString().split('T')[0]);
             }, 0);
             return () => clearTimeout(timeoutId);
        }
    }
  }, [data, selectedDay]);

  const { chartData, maxVal } = useMemo(() => {
    const hourlyData = Array(24).fill(0);
    let max = 0;
    data.forEach(point => {
      const pointDate = new Date(point.timestamp);
      if (pointDate.toISOString().split('T')[0] === selectedDay) {
        const hour = pointDate.getHours();
        const val = Number(point[metricKey] || 0);
        hourlyData[hour] += val;
      }
    });
    max = Math.max(...hourlyData) || 100; 
    return { chartData: hourlyData, maxVal: max };
  }, [data, selectedDay, metricKey]);


  const getTheme = () => {
    switch(metricKey) {
      case 'revenue': return { bar: 'bg-emerald-500', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-600' };
      case 'clicks': return { bar: 'bg-blue-500', text: 'text-blue-600', hover: 'group-hover:bg-blue-600' };
      case 'impressions': return { bar: 'bg-violet-500', text: 'text-violet-600', hover: 'group-hover:bg-violet-600' };
      default: return { bar: 'bg-blue-500', text: 'text-blue-600', hover: 'group-hover:bg-blue-600' };
    }
  };
  const theme = getTheme();

  return (
    <div className="w-full h-full flex flex-col px-2 pb-2">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Daily Breakdown
            </span>
            <span className="text-sm font-bold text-slate-700">
                {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 hover:border-slate-300 transition-colors">
            <CalendarIcon size={14} className="text-slate-400" />
            <input type="date" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="bg-transparent border-none outline-none text-xs font-medium text-slate-600 cursor-pointer font-mono" />
        </div>
      </div>

      {/* CHART CONTAINER*/}
      <div className="grow w-full relative flex gap-2">
        
        {/* Y-AXIS */}
        <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium pb-5 w-8 text-right">
            <span>{formatNumber(maxVal)}</span>
            <span>{formatNumber(maxVal * 0.75)}</span>
            <span>{formatNumber(maxVal * 0.5)}</span>
            <span>{formatNumber(maxVal * 0.25)}</span>
            <span>0</span>
        </div>

        {/* CHART AREA */}
        <div className="grow relative h-full">
            
            {/* Grid Lines (Background)*/}
            <div className="absolute inset-0 flex flex-col justify-between pb-5 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-b border-slate-100 border-dashed h-0"></div>
                ))}
            </div>

            {/* Bars Container */}
            <div className="w-full h-full flex items-end justify-between gap-1 relative z-10 pb-5">
                {chartData.map((val, hour) => {
                    const heightPercent = (val / maxVal) * 100;
                    
                    return (
                        <div key={hour} className="group relative flex flex-col justify-end items-center h-full flex-1">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 flex flex-col items-center">
                                <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    {formatNumber(val)}
                                </div>
                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-800"></div>
                            </div>

                            {/* Bar */}
                            <div 
                                style={{ height: `${heightPercent}%` }}
                                className={`w-full min-h-1rounded-t-sm transition-all duration-300 ${theme.bar} ${theme.hover} opacity-80 group-hover:opacity-100 relative`}
                            ></div>

                            {/* X-Label */}
                            <div className="absolute -bottom-5 text-[9px] text-slate-400 font-medium whitespace-nowrap">
                                {hour % 4 === 0 ? (hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`) : ''}
                            </div>
                            
                            {/* Hover Hitbox */}
                            <div className="absolute inset-0 bg-transparent z-0"></div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};