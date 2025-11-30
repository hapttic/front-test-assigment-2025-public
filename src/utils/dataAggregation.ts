import type { Metric, AggregationType, AggregatedDataPoint } from '../types/types';

function getAggregationKey(timestamp: string, aggregationType: AggregationType): string {
  const date = new Date(timestamp);
  
  switch (aggregationType) {
    case 'HOURLY':
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}:00:00`;
    
    case 'DAILY':
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
    case 'WEEKLY': {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getUTCDay();
      const diff = startOfWeek.getUTCDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setUTCDate(diff);
      return `${startOfWeek.getUTCFullYear()}-W${String(Math.ceil((startOfWeek.getUTCDate() + 6) / 7)).padStart(2, '0')}`;
    }
    
    case 'MONTHLY':
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    
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
    } else {
      aggregationMap.set(key, {
        timestamp: key,
        clicks: metric.clicks,
        revenue: metric.revenue,
        impressions: metric.impressions
      });
    }
  }

  return Array.from(aggregationMap.values()).sort(
    (a, b) => a.timestamp.localeCompare(b.timestamp)
  );
}

export function formatTimestampLabel(timestamp: string, aggregationType: AggregationType): string {
  switch (aggregationType) {
    case 'HOURLY': {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    case 'DAILY': {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    case 'WEEKLY':
      return timestamp;
    case 'MONTHLY': {
      const [year, month] = timestamp.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    default:
      return timestamp;
  }
}