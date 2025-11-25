export type Campaign = { id: string; name: string; platform: string };

export type MetricPoint = {
  campaignId: string;
  timestamp: string; 
  impressions: number;
  clicks: number;
  revenue: number;
};

export type Aggregation = 'hourly' | 'daily' | 'weekly' | 'monthly';

export type AggregatedRow = {
  key: string;         
  label: string;       
  start: string;       
  campaignsActive: number;
  impressions: number;
  clicks: number;
  revenue: number;
};
