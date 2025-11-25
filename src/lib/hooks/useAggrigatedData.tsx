import { useMemo } from "react";
import { aggregateData } from "../data/aggregateData";
import { useSearchParams } from "react-router-dom";
import type { AggregationPeriod, MetricEnum } from "../types";

export default function useAggrigatedData() {
  const [searchParams] = useSearchParams();
  const period = (searchParams.get("period") as AggregationPeriod) || "daily";
  const metric = (searchParams.get("metric") as MetricEnum) || "revenue";

  const data = useMemo(() => {
    return aggregateData(period);
  }, [period]);

  return { data, period, metric };
}
