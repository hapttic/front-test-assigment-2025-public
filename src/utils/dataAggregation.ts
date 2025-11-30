import { type Metric, AggregationType, type AggregatedDataPoint } from '../types/types';

const monthLabels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getAggregationKey(timestamp: string, aggregationType: AggregationType): string {
  const date = new Date(timestamp);

  const hour = String(date.getUTCHours()) + ':00';
  const day = String(date.getUTCDate());
  const month = monthLabels[date.getUTCMonth()];
  const year = String(date.getUTCFullYear());

  switch (aggregationType) {
    case 'HOURLY':
      return `${hour}, ${month} ${day}, ${year}`;
    case 'DAILY':
      return `${month} ${day}, ${year}`;
    case 'WEEKLY': {
      const weekNumber = Math.ceil(date.getUTCDate() / 7);
      return `Week ${weekNumber}, ${month} ${year}`;
    }
    case 'MONTHLY':
      return `${month} ${year}`;
    default:
      return timestamp;
  }
}

export function aggregateMetrics(
  metrics: Metric[],
  aggregationType: AggregationType
): AggregatedDataPoint[] {
  const aggregationMap = new Map<string, AggregatedDataPoint>();

  for (const metric of metrics) {
    const key = getAggregationKey(metric.timestamp, aggregationType);
    
    const existing = aggregationMap.get(key);
    
    if (existing) {
      existing.clicks += metric.clicks;
      existing.revenue += metric.revenue;
      existing.impressions += metric.impressions;
      existing.campaigns.add(metric.campaignId);
    } else {
      aggregationMap.set(key, {
        label: key,
        timestamp: metric.timestamp,
        clicks: metric.clicks,
        revenue: metric.revenue,
        impressions: metric.impressions,
        campaigns: new Set([metric.campaignId])
      });
    }
  }

  return Array.from(aggregationMap.values());
}