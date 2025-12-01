import { useMemo } from "react";
import type { Metric } from "../types";
import { aggregateMetrics } from "../utils/aggregate";

export function useAggregatedMetrics(
  metrics: Metric[],
  mode: "hourly" | "daily" | "weekly" | "monthly"
) {
  return useMemo(() => {
    return aggregateMetrics(metrics, mode);
  }, [metrics, mode]);
}
