/**
 * Custom React hook for loading campaign analytics data
 * Fetches data.json and extracts the metrics array
 */

import { useState, useEffect } from 'react';
import type { RawDataSource, MetricDataPoint } from '../types';

/**
 * Hook to fetch and load the campaign data from data.json
 * Returns the hourly metrics array and loading state
 */
export function useLoadData() {
  const [data, setData] = useState<MetricDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const rawData: RawDataSource = await response.json();
        setData(rawData.metrics);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error loading campaign data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, isLoading, error };
}
