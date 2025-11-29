export type AggregationLevel = "hourly" | "daily" | "weekly" | "monthly";

export interface AggregatedData {
  period: string;
  periodStart: Date;
  campaignsActive: string[];
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
}
