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

export interface AggregatedSlot {
  start: Date;
  end: Date;
  campaignsActive: number;
  impressions: number;
  clicks: number;
  revenue: number;
}

export type Mode = "hourly" | "daily" | "weekly" | "monthly";

export interface AggregationFilterProps {
  value: Mode;
  onChange: (value: Mode) => void;
  options: Mode[];
}
