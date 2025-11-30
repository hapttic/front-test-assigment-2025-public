export const AggregationType = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY'
} as const;
export type AggregationType = typeof AggregationType[keyof typeof AggregationType];

export const MetricType = {
  REVENUE: 'REVENUE',
  CLICKS: 'CLICKS',
} as const;
export type MetricType = typeof MetricType[keyof typeof MetricType];

export interface AggregationControlProps {
  aggregationType: AggregationType;
  setAggregationType: (type: AggregationType) => void;
}

export interface AggregationButtonProps {
  title: string;
  aggregationType: AggregationType;
  setAggregationType: (type: AggregationType) => void;
  isActive: boolean;
}

export interface TimelineChartProps {
  aggregationType: AggregationType;
}

export interface MetricTypeControlProps {
  metricType: MetricType;
  setMetricType: (type: MetricType) => void;
}

export interface MetricTypeButtonProps {
  title: string;
  metricType: MetricType;
  setMetricType: (type: MetricType) => void;
  isActive: boolean;
}