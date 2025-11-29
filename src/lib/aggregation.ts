import type { JoinedMetric } from "../../types/data";

export type AggregationLevel = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface AggregatedSlot {
  startUTC: number; 
  endUTC: number; 
  label: string; 
  campaignsActive: number;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
}

function startOfHourUTC(d: Date): Date {
  const nd = new Date(d.getTime());
  nd.setUTCMinutes(0, 0, 0);
  return nd;
}

function startOfDayUTC(d: Date): Date {
  const nd = new Date(d.getTime());
  nd.setUTCHours(0, 0, 0, 0);
  return nd;
}

function startOfISOWeekUTC(d: Date): Date {
  
  const day = d.getUTCDay();
  const nd = startOfDayUTC(d);
  const diffToMonday = (day + 6) % 7; 
  nd.setUTCDate(nd.getUTCDate() - diffToMonday);
  return nd;
}

function startOfMonthUTC(d: Date): Date {
  const nd = startOfDayUTC(d);
  nd.setUTCDate(1);
  return nd;
}

function endOfBucket(start: Date, level: AggregationLevel): Date {
  const e = new Date(start.getTime());
  switch (level) {
    case 'hourly': e.setUTCHours(e.getUTCHours() + 1); break;
    case 'daily': e.setUTCDate(e.getUTCDate() + 1); break;
    case 'weekly': e.setUTCDate(e.getUTCDate() + 7); break;
    case 'monthly': e.setUTCMonth(e.getUTCMonth() + 1); break;
  }
  return e;
}

function labelForBucket(start: Date, level: AggregationLevel): string {
  const y = start.getUTCFullYear();
  const m = String(start.getUTCMonth() + 1).padStart(2, '0');
  const d = String(start.getUTCDate()).padStart(2, '0');
  const h = String(start.getUTCHours()).padStart(2, '0');
  if (level === 'hourly') return `${y}-${m}-${d} ${h}:00 UTC`;
  if (level === 'daily') return `${y}-${m}-${d}`;
  if (level === 'monthly') return `${y}-${m}`;
  
  return `${y}-${m}-${d} (week)`;
}

function bucketStart(d: Date, level: AggregationLevel): Date {
  switch (level) {
    case 'hourly': return startOfHourUTC(d);
    case 'daily': return startOfDayUTC(d);
    case 'weekly': return startOfISOWeekUTC(d);
    case 'monthly': return startOfMonthUTC(d);
  }
}

export function aggregateMetrics(
  joined: JoinedMetric[],
  level: AggregationLevel
): AggregatedSlot[] {
  const buckets = new Map<number, {
    start: Date;
    end: Date;
    campaigns: Set<string>;
    impressions: number;
    clicks: number;
    revenue: number;
  }>();

  for (const m of joined) {
    const t = new Date(m.timestamp);
    const start = bucketStart(t, level);
    const end = endOfBucket(start, level);
    const key = start.getTime();
    let b = buckets.get(key);
    if (!b) {
      b = { start, end, campaigns: new Set(), impressions: 0, clicks: 0, revenue: 0 };
      buckets.set(key, b);
    }
    b.campaigns.add(m.campaignId);
    b.impressions += m.impressions;
    b.clicks += m.clicks;
    b.revenue += m.revenue;
  }

  const slots: AggregatedSlot[] = Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([key, b]) => ({
      startUTC: b.start.getTime(),
      endUTC: b.end.getTime(),
      label: labelForBucket(b.start, level),
      campaignsActive: b.campaigns.size,
      totalImpressions: b.impressions,
      totalClicks: b.clicks,
      totalRevenue: Number(b.revenue.toFixed(2)),
    }));

  return slots;
}