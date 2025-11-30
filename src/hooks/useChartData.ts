import { useMemo } from 'react';
import type { AggregatedSlot } from '../lib/aggregation';
import type { MetricKey, ChartData } from '../types/chart';
import {
  CHART_WIDTH,
  CHART_HEIGHT,
  CHART_MARGINS,
  CHART_INNER_WIDTH,
  CHART_INNER_HEIGHT,
} from '../constants/chart';

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
      if (maxX === minX) return CHART_MARGINS.left + CHART_INNER_WIDTH / 2;
      const ratio = (x - minX) / (maxX - minX);
      return CHART_MARGINS.left + ratio * CHART_INNER_WIDTH;
    };

    const yScale = (y: number) => {
      if (paddedMaxY === paddedMinY) return CHART_MARGINS.top + CHART_INNER_HEIGHT / 2;
      const ratio = (y - paddedMinY) / (paddedMaxY - paddedMinY);
      return CHART_MARGINS.top + (1 - ratio) * CHART_INNER_HEIGHT;
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
      dims: {
        w: CHART_WIDTH,
        h: CHART_HEIGHT,
        m: CHART_MARGINS,
        innerW: CHART_INNER_WIDTH,
        innerH: CHART_INNER_HEIGHT,
      },
    };
  }, [data, metricKey]);
}