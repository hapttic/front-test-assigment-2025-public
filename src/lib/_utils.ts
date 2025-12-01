import { format, startOfMonth, startOfWeek } from "date-fns";
import type { AggregationMode } from "./constants";

export type Metric = {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
};

type Args = {
  metrics: Metric[];
  mode: AggregationMode;
  campaignId: string;
};

export const aggregateMetrics = ({ metrics, mode, campaignId }: Args) => {
  const filteredMetrics =
    campaignId === "all"
      ? metrics
      : metrics.filter((m) => m.campaignId === campaignId);

  const getKey: (date: Date) => string | undefined = {
    hourly: (date: Date) => {
      return format(date, "yyyy-MM-dd HH:mm");
    },
    daily: (date: Date) => {
      return format(date, "yyyy-MM-dd");
    },
    weekly: (date: Date) => {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return format(weekStart, "yyyy-MM-dd");
    },
    monthly: (date: Date) => {
      const monthStart = startOfMonth(date);
      return format(monthStart, "yyyy-MM");
    },
  }[mode];

  const result: Record<string, Metric & { period?: string }> = {};

  for (const m of filteredMetrics) {
    const periodKey = getKey(new Date(m.timestamp));
    const campaignKey = m.campaignId;

    // Combined group key
    const key = `${campaignKey}-${periodKey}`;

    if (!result[key]) {
      result[key] = {
        campaignId: campaignKey,
        timestamp: m.timestamp,
        period: periodKey,
        impressions: 0,
        clicks: 0,
        revenue: 0,
      };
    }

    result[key].impressions += m.impressions;
    result[key].clicks += m.clicks;
    result[key].revenue += m.revenue;
  }

  const aggregated = Object.values(result);

  return aggregated;
};
