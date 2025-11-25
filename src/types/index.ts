export type TimeInterval = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface CampaignMetrics {
  dateKey: string;
  timestamp: number;
  impressions: number;
  clicks: number;
  revenue: number;
  activeCampaigns: number;
}