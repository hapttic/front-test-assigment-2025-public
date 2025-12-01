export interface CampaignData {
  metadata: Metadata;
  campaigns: Campaign[];
  metrics: Metric[];
}

export interface Metadata {
  generatedAt: string;
  description: string;
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

export type AggregationLevel = "hourly" | "daily" | "weekly" | "monthly";

export interface AggregatedData {
  period: string;
  periodStart: Date;
  campaignsActive: string[];
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
}
