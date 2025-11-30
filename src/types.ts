/**
 * Campaign Analytics Dashboard - Type Definitions
 * 
 * This module contains all TypeScript interfaces and types for the analytics dashboard.
 * These types ensure type safety throughout the application and provide clear contracts
 * for data structures used in aggregation, visualization, and UI components.
 */

/**
 * Represents a single marketing campaign with its metadata.
 * Source: data.json -> campaigns array
 */
export interface Campaign {
  /** Unique identifier for the campaign */
  id: string;
  
  /** Campaign name */
  name: string;
  
  /** Platform where the campaign is running (e.g., Instagram, LinkedIn) */
  platform: string;
}

/**
 * Represents a single hourly metric data point for a campaign.
 * Source: data.json -> metrics array
 * 
 * IMPORTANT: All timestamps are in UTC format and must be processed using UTC methods
 * to prevent timezone-related aggregation bugs.
 */
export interface MetricDataPoint {
  /** Reference to the campaign this metric belongs to */
  campaignId: string;
  
  /** ISO 8601 timestamp in UTC (e.g., "2025-08-26T12:47:48.369Z") */
  timestamp: string;
  
  /** Number of times the campaign was displayed */
  impressions: number;
  
  /** Number of user clicks on the campaign */
  clicks: number;
  
  /** Revenue generated in this time period (in currency units) */
  revenue: number;
}

/**
 * Represents the raw data structure from data.json file.
 * This is the top-level structure that contains both campaigns and metrics arrays.
 */
export interface RawDataSource {
  /** Metadata about the data file */
  metadata: {
    generatedAt: string;
    description: string;
  };
  
  /** Array of campaign metadata */
  campaigns: Campaign[];
  
  /** Array of hourly metric data points */
  metrics: MetricDataPoint[];
}

/**
 * Defines the available time aggregation levels for the dashboard.
 * 
 * - Hourly: Display raw hourly data points
 * - Daily: Aggregate data by calendar day (UTC midnight to midnight)
 * - Weekly: Aggregate data by week (Monday to Sunday based on UTC)
 * - Monthly: Aggregate data by calendar month (UTC)
 */
export type AggregationLevel = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';

/**
 * Represents an aggregated data point after processing raw hourly metrics.
 * This is the core data model used by both the chart and the data grid.
 * 
 * Each instance represents a time bucket (hour, day, week, or month) with
 * summed metrics across all campaigns that were active during that period.
 */
export interface AggregatedDataPoint {
  /**
   * ISO 8601 timestamp marking the start of this aggregation bucket (UTC).
   * For Daily: midnight of the day
   * For Weekly: midnight of Monday
   * For Monthly: midnight of the first day of the month
   */
  date: string;
  
  /**
   * Number of unique campaigns that had activity during this time period.
   * Calculated by counting distinct campaignIds with metrics in this bucket.
   */
  campaignsActive: number;
  
  /** Sum of all impressions across all campaigns in this time bucket */
  totalImpressions: number;
  
  /** Sum of all clicks across all campaigns in this time bucket */
  totalClicks: number;
  
  /** Sum of all revenue across all campaigns in this time bucket */
  totalRevenue: number;
}

/**
 * Defines which metric should be displayed on the timeline chart.
 * 
 * - Clicks: Display the totalClicks metric
 * - Revenue: Display the totalRevenue metric
 */
export type ChartMetric = 'Clicks' | 'Revenue';

/**
 * Defines the possible sort directions for the data grid.
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Defines the columns available for sorting in the data grid.
 */
export type SortableColumn = 'date' | 'totalRevenue';

/**
 * Represents the sorting state for the data grid.
 */
export interface SortState {
  /** The column currently being sorted, or null if no sorting is applied */
  column: SortableColumn | null;
  
  /** The direction of the current sort */
  direction: SortDirection;
}
