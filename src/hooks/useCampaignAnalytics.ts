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

interface ProcessedMetric {
  campaignId: string;
  ts: number;
  impressions: number;
  clicks: number;
  revenue: number;
}
//  Binary Search to find start index
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

//  Bucket Key Generator 
const getFastBucketInfo = (ts: number, aggregation: AggregationLevel) => {
  const date = new Date(ts);
  
  // Hourly
  if (aggregation === 'hourly') {
    const hourTs = Math.floor(ts / 3600000) * 3600000;
    return { 
      key: hourTs.toString(), 
      sortTime: hourTs,
      labelFn: () => new Date(hourTs).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true })
    };
  }

  // Daily
  if (aggregation === 'daily') {
    date.setHours(0, 0, 0, 0);
    const dayTs = date.getTime();
    return {
      key: dayTs.toString(),
      sortTime: dayTs,
      labelFn: () => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  }

  // Weekly & Monthly
  if (aggregation === 'weekly') {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // ორშაბათი რომ იყოს დასაწყისი
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    const weekTs = date.getTime();
    return {
        key: weekTs.toString(),
        sortTime: weekTs,
        labelFn: () => `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    };
  }

  // Monthly
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  const monthTs = date.getTime();
  return {
    key: monthTs.toString(),
    sortTime: monthTs,
    labelFn: () => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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

  //Initial Load
  useEffect(() => {
    setTimeout(() => {
      const processed = MOCK_DATA.metrics.map(m => ({
        ...m,
        ts: new Date(m.timestamp).getTime() 
      })).sort((a, b) => a.ts - b.ts);

      setProcessedData(processed);
      setLoading(false);
    }, 0);
  }, []);

  //Aggregation Logic
  const aggregatedData = useMemo(() => {
    if (processedData.length === 0) return [];

    const buckets = new Map<string, {
        point: AggregatedPoint,
        campaignIds: Set<string>,
        labelFn: () => string
    }>();

    const startTs = new Date(dateRange.start).getTime();
    const endTs = new Date(dateRange.end).getTime() + 86400000;

    //Binary Search to find starting index
    const startIndex = findStartIndex(processedData, startTs);

    // Loop starts from startIndex and ends when we exceed endTs
    for (let i = startIndex; i < processedData.length; i++) {
      const m = processedData[i];

      // Early Exit
      if (m.ts >= endTs) break;

      const { key, sortTime, labelFn } = getFastBucketInfo(m.ts, aggregation);

      if (!buckets.has(key)) {
        buckets.set(key, {
            point: {
                dateKey: "", 
                timestamp: sortTime,
                impressions: 0,
                clicks: 0,
                revenue: 0,
                activeCampaigns: 0
            },
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

    // Final Formation
    const result = Array.from(buckets.values()).map(({ point, campaignIds, labelFn }) => ({
        ...point,
        dateKey: labelFn(), 
        activeCampaigns: campaignIds.size,
        revenue: Number(point.revenue.toFixed(2))
    }));

    return result.sort((a, b) => a.timestamp - b.timestamp);

  }, [processedData, aggregation, dateRange]);

  // Totals Calculation 
  const totals = useMemo(() => {
    if (processedData.length === 0) return { revenue: 0, clicks: 0, impressions: 0 };
    
    const startTs = new Date(dateRange.start).getTime();
    const endTs = new Date(dateRange.end).getTime() + 86400000;
    
    const startIndex = findStartIndex(processedData, startTs);

    let revenue = 0;
    let clicks = 0;
    let impressions = 0;

    for (let i = startIndex; i < processedData.length; i++) {
        const m = processedData[i];
        if (m.ts >= endTs) break;

        revenue += m.revenue;
        clicks += m.clicks;
        impressions += m.impressions;
    }

    return {
        revenue: Number(revenue.toFixed(2)),
        clicks,
        impressions
    };
  }, [processedData, dateRange]);

  return {
    loading,
    aggregatedData,
    totals,
    aggregation,
    setAggregation,
    dateRange,
    setDateRange,
  };
};