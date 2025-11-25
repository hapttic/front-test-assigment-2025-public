import { useCallback, useEffect, useState } from "react";
import { aggregateData } from "../data/aggregateData";
import { useSearchParams } from "react-router-dom";
import type { AggregatedData, AggregationPeriod, MetricEnum } from "../types";

export default function useAggrigatedData() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AggregatedData[]>([]);

  const [searchParams] = useSearchParams();
  const period = (searchParams.get("period") as AggregationPeriod) || "daily";
  const metric = (searchParams.get("metric") as MetricEnum) || "revenue";

  const getData = useCallback(async () => {
    return await aggregateData(period);
  }, [period]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const res = await getData();
        setData(res);
      } catch (error) {
        console.log("Error fetching aggregated data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [getData, period, metric]);

  return { isLoading, data, period, metric };
}
