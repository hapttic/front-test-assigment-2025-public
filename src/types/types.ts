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

export interface TimelineChartSectionProps {
  aggregationType: AggregationType;
  metrics: AggregatedDataPoint[];
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

export interface TimelineChartProps {
  title: string;
  data: AggregatedDataPoint[];
  metricType: MetricType;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
}

export interface Metric {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface ApiResponse {
  metadata: {
    generatedAt: string;
    description: string;
  };
  campaigns: Campaign[];
  metrics: Metric[];
}

export interface UseDataFetchResult {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export interface AggregatedDataPoint {
  timestamp: string;
  clicks: number;
  revenue: number;
  impressions: number;
}