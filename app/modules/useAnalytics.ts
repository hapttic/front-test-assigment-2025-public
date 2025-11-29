"use client";

import { useEffect, useState, useMemo } from "react";
import { AggregationMode, JoinedMetric, AggregatedRow } from "../lib/types";
import { fetchAnalyticsData } from "../lib/fetchData";
import { joinData } from "../lib/joinData";
import { aggregateData } from "../lib/aggregateData";

export function useAnalytics(mode: AggregationMode) {
  const [joined, setJoined] = useState<JoinedMetric[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // datas wamovighebt 1xel momxreblis mxares
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { campaigns, metrics } = await fetchAnalyticsData();
        const joinedResult = joinData(campaigns, metrics);

        setJoined(joinedResult);
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);
  // useMemo  to=for avoid recalculating on every re-rendersss
  const aggregated: AggregatedRow[] | null = useMemo(() => {
    if (!joined) return null;
    return aggregateData(joined, mode);
  }, [joined, mode]);

  return {
    loading,
    error,
    data: aggregated,
  };
}
