import { useMemo } from 'react';
import type { AggregatedSlot } from '../lib/aggregation';

const CHART_WIDTH = 800;
const CHART_HEIGHT = 300;
const MARGINS = { top: 20, right: 20, bottom: 30, left: 40 };

const INNER_WIDTH = CHART_WIDTH - MARGINS.left - MARGINS.right;
const INNER_HEIGHT = CHART_HEIGHT - MARGINS.top - MARGINS.bottom;

type MetricKey = 'totalClicks' | 'totalRevenue';

interface ChartData {
  path: string;
  points: { x: number; y: number }[];
  minY: number;
  maxY: number;
  minX: number;
  maxX: number;

  dims: { w: number; h: number; m: typeof MARGINS; innerW: number; innerH: number };
}

export function useChartData(data: AggregatedSlot[], metricKey: MetricKey): ChartData {
  return useMemo(() => {

    const xs = data.map((d) => d.startUTC);
    const ys = data.map((d) => d[metricKey]);


    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

  
    const yPad = (maxY - minY) * 0.05 || 1;
    const paddedMinY = minY - yPad;
    const paddedMaxY = maxY + yPad;

    
    const xScale = (x: number) => {
    
      if (maxX === minX) return MARGINS.left + INNER_WIDTH / 2;
      
      const ratio = (x - minX) / (maxX - minX);
      return MARGINS.left + ratio * INNER_WIDTH;
    };
    
    const yScale = (y: number) => {
 
      if (paddedMaxY === paddedMinY) return MARGINS.top + INNER_HEIGHT / 2;
      
      const ratio = (y - paddedMinY) / (paddedMaxY - paddedMinY);
      
      return MARGINS.top + (1 - ratio) * INNER_HEIGHT;
    };

    
    const points = data.map((d) => ({ 
      x: xScale(d.startUTC), 
      y: yScale(d[metricKey]) 
    }));


    const path = points.reduce((acc, p, i) => 
      acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), 
      ''
    );

    return { 
      path, 
      points, 
      minY: paddedMinY, 
      maxY: paddedMaxY, 
      minX, 
      maxX,
      dims: { w: CHART_WIDTH, h: CHART_HEIGHT, m: MARGINS, innerW: INNER_WIDTH, innerH: INNER_HEIGHT }
    };
  }, [data, metricKey]);
}