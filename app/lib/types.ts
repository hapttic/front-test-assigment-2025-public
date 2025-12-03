export interface Campaign {
    id: string;
    name: string;
    platform: string;
  }
  
  export interface MetricPoint {
    campaignId: string;
    timestamp: string; 
    impressions: number;
    clicks: number;
    revenue: number;
  }
  
  export interface JoinedMetric extends MetricPoint {
    campaignName: string;
    platform: string;
  }
  
  export type AggregationMode = "hourly" | "daily" | "weekly" | "monthly";
  
  export interface AggregatedRow {
    date: string;
    campaignsActive: number;
    impressions: number;
    clicks: number;
    revenue: number;
  }
  