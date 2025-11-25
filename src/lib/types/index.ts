export interface Metric {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface AggregatedData {
  timestamp: string;
  campaignsActive: number;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
}

export type AggregationPeriod = "hourly" | "daily" | "weekly" | "monthly";
export type MetricEnum = "clicks" | "revenue";
