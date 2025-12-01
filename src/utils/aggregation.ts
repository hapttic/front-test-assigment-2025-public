/**
 * Data Aggregation Utilities
 * 
 * This module implements UTC-compliant time-series data aggregation.
 * All date operations use UTC methods to prevent timezone-related bugs.
 * 
 * Performance: O(N) single-pass algorithm using Map for efficient grouping.
 */

import type {
  MetricDataPoint,
  AggregatedDataPoint,
  AggregationLevel,
} from '../types';

/**
 * Generates a UTC-based date key for aggregation buckets.
 * Correct data grouping across timezones.
 * 
 * @param date - JavaScript Date object (created from UTC timestamp)
 * @param level - The aggregation level (Hourly, Daily, Weekly, Monthly)
 * @returns ISO 8601 string representing the start of the aggregation bucket
 * 
 * @example
 * // For Daily: "2025-08-26T00:00:00.000Z" (UTC midnight)
 * // For Weekly: "2025-08-25T00:00:00.000Z" (Monday UTC midnight)
 * // For Monthly: "2025-08-01T00:00:00.000Z" (1st of month UTC midnight)
 */
function getAggregationKey(date: Date, level: AggregationLevel): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();

  switch (level) {
    case 'Hourly':
      // Keep the exact hour
      return new Date(Date.UTC(year, month, day, hours, 0, 0, 0)).toISOString();

    case 'Daily':
      // Set to UTC midnight of the day
      return new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).toISOString();

    case 'Weekly': {
      // Get the Monday of the week (ISO 8601 week starts on Monday)
      const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust Sunday to be 6 days after Monday
      const monday = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      monday.setUTCDate(day - daysToMonday);
      return monday.toISOString();
    }

    case 'Monthly':
      // Set to the 1st day of the month at UTC midnight
      return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)).toISOString();

    default:
      throw new Error(`Invalid aggregation level: ${level}`);
  }
}

/**
 * Aggregates hourly metric data into time buckets based on the specified level.
 * 
 * Algorithm: Single-pass O(N) using Map for efficient grouping.
 * - Iterates through all metric points once
 * - Groups by UTC-based date key
 * - Accumulates metrics per bucket
 * - Tracks unique campaign IDs per bucket
 * 
 * @param metrics - Array of hourly metric data points
 * @param level - The aggregation level (Hourly, Daily, Weekly, Monthly)
 * @returns Array of aggregated data points sorted by date (ascending)
 * 
 * @example
 * const aggregated = aggregateData(metrics, 'Daily');
 * // Returns: [{ date: "2025-08-26T00:00:00.000Z", campaignsActive: 5, ... }, ...]
 */
export function aggregateData(
  metrics: MetricDataPoint[],
  level: AggregationLevel
): AggregatedDataPoint[] {
  const bucketMap = new Map<
    string,
    {
      totalImpressions: number;
      totalClicks: number;
      totalRevenue: number;
      campaignIds: Set<string>;
    }
  >();

  for (const metric of metrics) {
    const date = new Date(metric.timestamp);
    const key = getAggregationKey(date, level);

    let bucket = bucketMap.get(key);
    if (!bucket) {
      bucket = {
        totalImpressions: 0,
        totalClicks: 0,
        totalRevenue: 0,
        campaignIds: new Set<string>(),
      };
      bucketMap.set(key, bucket);
    }

    bucket.totalImpressions += metric.impressions;
    bucket.totalClicks += metric.clicks;
    bucket.totalRevenue += metric.revenue;
    bucket.campaignIds.add(metric.campaignId);
  }

  const result: AggregatedDataPoint[] = [];
  
  for (const [dateKey, bucket] of bucketMap.entries()) {
    result.push({
      date: dateKey,
      campaignsActive: bucket.campaignIds.size,
      totalImpressions: bucket.totalImpressions,
      totalClicks: bucket.totalClicks,
      totalRevenue: bucket.totalRevenue,
    });
  }

  // Sort by date ascending (oldest first)
  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return result;
}

/**
 * Formats a date string for display in the UI.
 * Uses UTC date components to maintain consistency with aggregation.
 * 
 * @param dateString - ISO 8601 date string
 * @param level - The aggregation level (affects formatting)
 * @returns Formatted date string for display
 * 
 * @example
 * formatDate("2025-08-26T00:00:00.000Z", "Daily")  // "Aug 26, 2025"
 * formatDate("2025-08-26T12:00:00.000Z", "Hourly") // "Aug 26, 2025 12:00"
 */
export function formatDate(dateString: string, level: AggregationLevel): string {
  const date = new Date(dateString);
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  
  switch (level) {
    case 'Hourly': {
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${month} ${day}, ${year} ${hours}:${minutes}`;
    }
    
    case 'Daily':
      return `${month} ${day}, ${year}`;
    
    case 'Weekly': {
      // Show the Monday date for weekly buckets
      return `Week of ${month} ${day}, ${year}`;
    }
    
    case 'Monthly':
      return `${month} ${year}`;
    
    default:
      return dateString;
  }
}
