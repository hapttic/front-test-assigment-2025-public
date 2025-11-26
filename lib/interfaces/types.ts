// I am using one file since we only have a few types
export interface CampaignItem {
  id: string;
  name: string;
  platform: string;
}

export interface MetricItem {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface MetricWithCampaignItem extends MetricItem {
  campaignName: string;
  campaignPlatform: string;
}

export type Aggregation = "hourly" | "daily" | "weekly" | "monthly";

export interface AggregatedData {
  period: string;
  campaignsActive: number;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
}
export interface AnalyticsApiResponse {
  data: AggregatedData[];
  total: number;
}

export interface DataFilters {
  pageNumber: number;
  pageSize: number;
  aggregationType: Aggregation;
}
