import { useState, useEffect, useMemo } from 'react';
import type { DataFile, AggregationLevel, AggregatedDataPoint, SortField, SortDirection } from '../types';
import { loadData } from '../utils/dataLoader';
import { aggregateMetrics } from '../utils/aggregation';

export function useAggregatedData() {
  const [data, setData] = useState<DataFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aggregationLevel, setAggregationLevel] = useState<AggregationLevel>('daily');
  const [sortField, setSortField] = useState<SortField>('period');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Load data on mount
  useEffect(() => {
    loadData()
      .then((loadedData) => {
        setData(loadedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      });
  }, []);

  // Aggregate data based on level (memoized for performance)
  const aggregatedData = useMemo<AggregatedDataPoint[]>(() => {
    if (!data) return [];
    return aggregateMetrics(data.metrics, aggregationLevel);
  }, [data, aggregationLevel]);

  // Sort aggregated data (memoized)
  const sortedData = useMemo<AggregatedDataPoint[]>(() => {
    const sorted = [...aggregatedData];
    
    sorted.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortField) {
        case 'period':
          compareValue = a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case 'revenue':
          compareValue = a.totalRevenue - b.totalRevenue;
          break;
        case 'clicks':
          compareValue = a.totalClicks - b.totalClicks;
          break;
        case 'impressions':
          compareValue = a.totalImpressions - b.totalImpressions;
          break;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
    
    return sorted;
  }, [aggregatedData, sortField, sortDirection]);

  return {
    data,
    loading,
    error,
    aggregationLevel,
    setAggregationLevel,
    aggregatedData: sortedData,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
  };
}

