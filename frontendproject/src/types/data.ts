export type MetricRecord = {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
};

export type AggregationLevel = "hourly" | "daily" | "weekly" | "monthly";

export type AggregatedBucket = {
  key: string;
  label: string;
  totalClicks: number;
};

