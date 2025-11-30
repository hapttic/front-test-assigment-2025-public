export type MetricType = 'clicks' | 'revenue';
export type MetricKey = 'totalClicks' | 'totalRevenue';

export interface ChartDimensions {
  w: number;
  h: number;
  m: { top: number; right: number; bottom: number; left: number };
  innerW: number;
  innerH: number;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartData {
  path: string;
  points: ChartPoint[];
  minY: number;
  maxY: number;
  minX: number;
  maxX: number;
  dims: ChartDimensions;
}


