import type { AggregatedRow, Aggregation, MetricPoint } from '../types';

export function startOfBucketISO(ts: string, agg: Aggregation): string {
  const d = new Date(ts);
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), date = d.getUTCDate(), h = d.getUTCHours();

  if (agg === 'hourly') return new Date(Date.UTC(y, m, date, h, 0, 0)).toISOString();
  if (agg === 'daily') return new Date(Date.UTC(y, m, date, 0, 0, 0)).toISOString();
  if (agg === 'monthly') return new Date(Date.UTC(y, m, 1, 0, 0, 0)).toISOString();

 
  const isoDay = d.getUTCDay() === 0 ? 7 : d.getUTCDay(); 
  const diff = isoDay - 1;
  const start = new Date(Date.UTC(y, m, date, 0, 0, 0));
  start.setUTCDate(start.getUTCDate() - diff);
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0)).toISOString();
}

export function labelForIsoKey(keyIso: string, agg: Aggregation): string {
  const d = new Date(keyIso);
  if (agg === 'hourly') return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  if (agg === 'daily') return d.toISOString().slice(0, 10);
  if (agg === 'monthly') return d.toISOString().slice(0, 7);
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 6);
  return `${d.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;
}

export function aggregateMetrics(metrics: MetricPoint[], agg: Aggregation): AggregatedRow[] {
  const map = new Map<string, { impressions:number; clicks:number; revenue:number; campaigns:Set<string> }>();
  for (const m of metrics) {
    const key = startOfBucketISO(m.timestamp, agg);
    const cur = map.get(key);
    if (cur) {
      cur.impressions += m.impressions;
      cur.clicks += m.clicks;
      cur.revenue += m.revenue;
      cur.campaigns.add(m.campaignId);
    } else {
      map.set(key, { impressions: m.impressions, clicks: m.clicks, revenue: m.revenue, campaigns: new Set([m.campaignId]) });
    }
  }
  const rows: AggregatedRow[] = Array.from(map.entries()).map(([key, val]) => ({
    key,
    label: labelForIsoKey(key, agg),
    start: key,
    campaignsActive: val.campaigns.size,
    impressions: val.impressions,
    clicks: val.clicks,
    revenue: Number(val.revenue.toFixed(2))
  }));
  rows.sort((a,b) => a.start.localeCompare(b.start));
  return rows;
}
