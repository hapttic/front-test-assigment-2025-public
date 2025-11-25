import type { Metric, AggregatedDataPoint, AggregationLevel } from '../types';

/**
 * Gets the period key for a given timestamp based on aggregation level
 * Uses UTC to avoid timezone bugs
 */
function getPeriodKey(date: Date, level: AggregationLevel): string {
  switch (level) {
    case 'hourly':
      return date.toISOString(); // Full ISO timestamp
    case 'daily':
      return date.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD
    case 'weekly': {
      // ISO Week format: YYYY-Www
      const year = date.getUTCFullYear();
      const week = getISOWeek(date);
      return `${year}-W${String(week).padStart(2, '0')}`;
    }
    case 'monthly': {
      // Format: YYYY-MM
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    }
  }
}

/**
 * Gets ISO week number (1-53)
 * ISO weeks start on Monday
 */
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getUTCDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Gets a human-readable label for the period
 */
function getPeriodLabel(periodKey: string, level: AggregationLevel): string {
  switch (level) {
    case 'hourly': {
      const date = new Date(periodKey);
      return date.toISOString().replace('T', ' ').substring(0, 13) + ':00';
    }
    case 'daily':
      return periodKey; // Already in YYYY-MM-DD format
    case 'weekly':
      return periodKey; // YYYY-Www format
    case 'monthly': {
      const [year, month] = periodKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(month ?? '1', 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    }
  }
}

/**
 * Gets the start timestamp for a period (for sorting)
 */
function getPeriodStartDate(periodKey: string, level: AggregationLevel): Date {
  switch (level) {
    case 'hourly':
      return new Date(periodKey);
    case 'daily':
      return new Date(periodKey + 'T00:00:00.000Z');
    case 'weekly': {
      // Parse YYYY-Www format
      const [yearStr, weekStr] = periodKey.split('-W');
      const year = parseInt(yearStr ?? '2025', 10);
      const week = parseInt(weekStr ?? '1', 10);
      // Get first day of year
      const jan4 = new Date(Date.UTC(year, 0, 4));
      const jan4Day = (jan4.getUTCDay() + 6) % 7;
      const weekStart = new Date(jan4.valueOf());
      weekStart.setUTCDate(jan4.getUTCDate() - jan4Day + (week - 1) * 7);
      return weekStart;
    }
    case 'monthly': {
      return new Date(periodKey + '-01T00:00:00.000Z');
    }
  }
}

/**
 * Aggregates metrics based on the selected aggregation level
 */
export function aggregateMetrics(
  metrics: Metric[],
  level: AggregationLevel
): AggregatedDataPoint[] {
  // Group metrics by period
  const grouped = new Map<string, {
    campaigns: Set<string>;
    impressions: number;
    clicks: number;
    revenue: number;
  }>();

  for (const metric of metrics) {
    const date = new Date(metric.timestamp);
    const periodKey = getPeriodKey(date, level);

    const existing = grouped.get(periodKey);
    if (existing) {
      existing.campaigns.add(metric.campaignId);
      existing.impressions += metric.impressions;
      existing.clicks += metric.clicks;
      existing.revenue += metric.revenue;
    } else {
      grouped.set(periodKey, {
        campaigns: new Set([metric.campaignId]),
        impressions: metric.impressions,
        clicks: metric.clicks,
        revenue: metric.revenue,
      });
    }
  }

  // Convert to array of AggregatedDataPoint
  const result: AggregatedDataPoint[] = [];
  for (const [periodKey, data] of grouped.entries()) {
    result.push({
      period: periodKey,
      periodLabel: getPeriodLabel(periodKey, level),
      campaignsActive: data.campaigns,
      totalImpressions: data.impressions,
      totalClicks: data.clicks,
      totalRevenue: data.revenue,
      timestamp: getPeriodStartDate(periodKey, level),
    });
  }

  // Sort by timestamp (oldest first)
  result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return result;
}

