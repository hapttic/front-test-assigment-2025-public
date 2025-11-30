export type TimeInterval = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface CampaignMetrics {
  campaignId: string;
  timestamp: number;
  impressions: number;
  clicks: number;
  revenue: number;
}

export type MetricType = 'revenue' | 'clicks' | 'impressions';