import { useState, useEffect, useMemo } from 'react';
import { MOCK_DATA } from '../data/mockData'; 

export type AggregationLevel = 'daily' | 'hourly' | 'weekly' | 'monthly';

export interface AggregatedPoint {
  dateKey: string;
  timestamp: number;
  impressions: number;
  clicks: number;
  revenue: number;
  activeCampaigns: number;
}

export interface PlatformStat {
  platform: string;
  revenue: number;
  clicks: number;
  impressions: number;
}

interface ProcessedMetric {
  campaignId: string;
  platform: string;
  ts: number;
  impressions: number;
  clicks: number;
  revenue: number;
}

// Helpers
const findStartIndex = (data: ProcessedMetric[], targetTime: number): number => {
  let left = 0;
  let right = data.length - 1;
  let result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (data[mid].ts >= targetTime) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result === -1 ? 0 : result;
};

const getFastBucketInfo = (ts: number, aggregation: AggregationLevel) => {
  const date = new Date(ts);
  if (aggregation === 'hourly') {
    const hourTs = Math.floor(ts / 3600000) * 3600000;
    return { key: hourTs.toString(), sortTime: hourTs, labelFn: () => new Date(hourTs).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true }) };
  }
  if (aggregation === 'daily') {
    date.setHours(0, 0, 0, 0); const dayTs = date.getTime();
    return { key: dayTs.toString(), sortTime: dayTs, labelFn: () => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
  }
  if (aggregation === 'weekly') {
    const day = date.getDay(); const diff = date.getDate() - day + (day === 0 ? -6 : 1); date.setDate(diff); date.setHours(0, 0, 0, 0); const weekTs = date.getTime();
    return { key: weekTs.toString(), sortTime: weekTs, labelFn: () => `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` };
  }
  date.setDate(1); date.setHours(0, 0, 0, 0); const monthTs = date.getTime();
  return { key: monthTs.toString(), sortTime: monthTs, labelFn: () => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
};

export const useCampaignAnalytics = () => {
  const [processedData, setProcessedData] = useState<ProcessedMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregation, setAggregation] = useState<AggregationLevel>('daily');
  const [dateRange, setDateRange] = useState({ start: '2025-08-26', end: '2025-11-24' });

  // Initial Load
  useEffect(() => {
    setTimeout(() => {
      const campaignMap = new Map(MOCK_DATA.campaigns.map(c => [c.id, c.platform]));
      const processed = MOCK_DATA.metrics.map(m => ({
        ...m,
        platform: campaignMap.get(m.campaignId) || 'Unknown',
        ts: new Date(m.timestamp).getTime() 
      })).sort((a, b) => a.ts - b.ts);
      setProcessedData(processed);
      setLoading(false);
    }, 0);
  }, []);

  // Chart Aggregation
  const aggregatedData = useMemo(() => {
    if (processedData.length === 0) return [];
    const buckets = new Map<string, { point: AggregatedPoint, campaignIds: Set<string>, labelFn: () => string }>();
    const startTs = new Date(dateRange.start).getTime();
    const endTs = new Date(dateRange.end).getTime() + 86400000;
    const startIndex = findStartIndex(processedData, startTs);

    for (let i = startIndex; i < processedData.length; i++) {
      const m = processedData[i];
      if (m.ts >= endTs) break;
      const { key, sortTime, labelFn } = getFastBucketInfo(m.ts, aggregation);
      if (!buckets.has(key)) buckets.set(key, { point: { dateKey: "", timestamp: sortTime, impressions: 0, clicks: 0, revenue: 0, activeCampaigns: 0 }, campaignIds: new Set(), labelFn });
      const bucket = buckets.get(key)!;
      bucket.point.impressions += m.impressions;
      bucket.point.clicks += m.clicks;
      bucket.point.revenue += m.revenue;
      bucket.campaignIds.add(m.campaignId);
    }
    return Array.from(buckets.values()).map(({ point, campaignIds, labelFn }) => ({ ...point, dateKey: labelFn(), activeCampaigns: campaignIds.size, revenue: Number(point.revenue.toFixed(2)) })).sort((a, b) => a.timestamp - b.timestamp);
  }, [processedData, aggregation, dateRange]);

  // Platform Stats
  const platformStats = useMemo<PlatformStat[]>(() => {
    if (processedData.length === 0) return [];
    const startTs = new Date(dateRange.start).getTime();
    const endTs = new Date(dateRange.end).getTime() + 86400000;
    const startIndex = findStartIndex(processedData, startTs);
    const statsMap = new Map<string, PlatformStat>();
    ['TikTok', 'Instagram', 'LinkedIn', 'Google', 'Email'].forEach(p => statsMap.set(p, { platform: p, revenue: 0, clicks: 0, impressions: 0 }));

    for (let i = startIndex; i < processedData.length; i++) {
        const m = processedData[i];
        if (m.ts >= endTs) break;
        const pStat = statsMap.get(m.platform);
        if (pStat) { pStat.revenue += m.revenue; pStat.clicks += m.clicks; pStat.impressions += m.impressions; }
    }
    return Array.from(statsMap.values());
  }, [processedData, dateRange]);

  // Totals & Advanced Metrics 
  const totals = useMemo(() => {
    if (processedData.length === 0) return { 
        revenue: 0, clicks: 0, impressions: 0, 
        ctr: 0, rpc: 0, avgDailyRevenue: 0, avgDailyClicks: 0 
    };
    
    const startTs = new Date(dateRange.start).getTime();
    const endTs = new Date(dateRange.end).getTime() + 86400000;
    const startIndex = findStartIndex(processedData, startTs);

    let revenue = 0; let clicks = 0; let impressions = 0;

    for (let i = startIndex; i < processedData.length; i++) {
        const m = processedData[i];
        if (m.ts >= endTs) break;
        revenue += m.revenue; clicks += m.clicks; impressions += m.impressions;
    }

    // Advanced Metrics Calculation
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysCount = Math.max(1, Math.ceil((endTs - startTs) / msPerDay));

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const rpc = clicks > 0 ? revenue / clicks : 0;
    const avgDailyRevenue = revenue / daysCount;
    const avgDailyClicks = clicks / daysCount;

    return { 
        revenue: Number(revenue.toFixed(2)), 
        clicks, 
        impressions,
        ctr: Number(ctr.toFixed(2)),
        rpc: Number(rpc.toFixed(2)),
        avgDailyRevenue: Number(avgDailyRevenue.toFixed(2)),
        avgDailyClicks: Math.round(avgDailyClicks)
    };
  }, [processedData, dateRange]);

  return { loading, aggregatedData, totals, platformStats, aggregation, setAggregation, dateRange, setDateRange };
};