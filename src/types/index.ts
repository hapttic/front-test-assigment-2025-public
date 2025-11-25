// Core data types based on data.json structure

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

export interface DataFile {
  metadata: Metadata;
  campaigns: Campaign[];
  metrics: Metric[];
}

// Aggregation types
export type AggregationLevel = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface AggregatedDataPoint {
  period: string; // ISO date string or period identifier
  periodLabel: string; // Human-readable label for display
  campaignsActive: Set<string>; // Set of unique campaign IDs
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
  timestamp: Date; // For sorting
}

export type SortField = 'period' | 'revenue' | 'clicks' | 'impressions';
export type SortDirection = 'asc' | 'desc';

