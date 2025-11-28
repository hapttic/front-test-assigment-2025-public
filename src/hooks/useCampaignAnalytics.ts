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

// Helper
const getBucketInfo = (ts: number, aggregation: AggregationLevel) => {
  const date = new Date(ts);
  
  if (aggregation === 'hourly') {
    date.setMinutes(0, 0, 0);
    const sortTime = date.getTime();
    return { 
        key: sortTime.toString(), 
        sortTime, 
        labelFn: () => new Date(sortTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true }) 
    };
  }
  
  if (aggregation === 'daily') {
    date.setHours(0, 0, 0, 0);
    const sortTime = date.getTime();
    return { 
        key: sortTime.toString(), 
        sortTime, 
        labelFn: () => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    };
  }

  if (aggregation === 'weekly') {
    const day = date.getDay(); 
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    const sortTime = date.getTime();
    return { 
        key: sortTime.toString(), 
        sortTime, 
        labelFn: () => `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
    };
  }

  // Monthly
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  const sortTime = date.getTime();
  return { 
      key: sortTime.toString(), 
      sortTime, 
      labelFn: () => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
  };
};

export const useCampaignAnalytics = () => {
  const [processedData, setProcessedData] = useState<ProcessedMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregation, setAggregation] = useState<AggregationLevel>('daily');
  const [dateRange, setDateRange] = useState({
    start: '2025-08-26',
    end: '2025-11-24'
  });

  // Initial Data Processing
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

  // Filtered Data by Date Range
  const filteredData = useMemo(() => {
      if (processedData.length === 0) return [];

      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const startTs = startDate.getTime();
      const endTs = endDate.getTime();

      return processedData.filter(m => m.ts >= startTs && m.ts <= endTs);
  }, [processedData, dateRange]);


  // Aggregation Logic 
  const aggregatedData = useMemo(() => {
    const buckets = new Map<string, { point: AggregatedPoint, campaignIds: Set<string>, labelFn: () => string }>();

    for (const m of filteredData) {
      const { key, sortTime, labelFn } = getBucketInfo(m.ts, aggregation);

      if (!buckets.has(key)) {
        buckets.set(key, { 
            point: { dateKey: "", timestamp: sortTime, impressions: 0, clicks: 0, revenue: 0, activeCampaigns: 0 }, 
            campaignIds: new Set(), 
            labelFn 
        });
      }
      
      const bucket = buckets.get(key)!;
      bucket.point.impressions += m.impressions;
      bucket.point.clicks += m.clicks;
      bucket.point.revenue += m.revenue;
      bucket.campaignIds.add(m.campaignId);
    }

    return Array.from(buckets.values())
        .map(({ point, campaignIds, labelFn }) => ({ 
            ...point, 
            dateKey: labelFn(), 
            activeCampaigns: campaignIds.size, 
            revenue: Number(point.revenue.toFixed(2)) 
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredData, aggregation]);


  //  Platform Stats Logic 
  const platformStats = useMemo<PlatformStat[]>(() => {
    const statsMap = new Map<string, PlatformStat>();
    ['TikTok', 'Instagram', 'LinkedIn', 'Google', 'Email'].forEach(p => statsMap.set(p, { platform: p, revenue: 0, clicks: 0, impressions: 0 }));

    for (const m of filteredData) {
        const pStat = statsMap.get(m.platform);
        if (pStat) { 
            pStat.revenue += m.revenue; 
            pStat.clicks += m.clicks; 
            pStat.impressions += m.impressions; 
        }
    }
    return Array.from(statsMap.values());
  }, [filteredData]);


  //  Totals (KPI)
  const totals = useMemo(() => {
    let revenue = 0; let clicks = 0; let impressions = 0;

    for (const m of filteredData) {
        revenue += m.revenue; 
        clicks += m.clicks; 
        impressions += m.impressions;
    }

    const startTs = new Date(dateRange.start).getTime();
    const endTs = new Date(dateRange.end).getTime();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysCount = Math.max(1, Math.ceil((endTs - startTs) / msPerDay)); 

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const rpc = clicks > 0 ? revenue / clicks : 0;
    const avgDailyRevenue = revenue / daysCount;
    const avgDailyClicks = clicks / daysCount;

    return { 
        revenue: Number(revenue.toFixed(2)), clicks, impressions,
        ctr: Number(ctr.toFixed(2)), rpc: Number(rpc.toFixed(2)),
        avgDailyRevenue: Number(avgDailyRevenue.toFixed(2)), avgDailyClicks: Math.round(avgDailyClicks)
    };
  }, [filteredData, dateRange]); 

  return { loading, aggregatedData, totals, platformStats, aggregation, setAggregation, dateRange, setDateRange };
};