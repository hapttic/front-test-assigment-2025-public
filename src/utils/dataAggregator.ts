import type { CampaignData, AggregationLevel, AggregatedData, Metric } from "../types";

const groupByTimePeriod = (metrics: Metric[], aggregation: AggregationLevel): Map<string, Metric[]> => {
  const groups = new Map<string, Metric[]>();

  metrics.forEach((metric) => {
    const date = new Date(metric.timestamp);
    let key: string;

    switch (aggregation) {
      case "hourly":
        key = date.toISOString().slice(0, 13);
        break;
      case "daily":
        key = date.toISOString().slice(0, 10);
        break;
      case "weekly": {
        const weekNumber = getWeek(date);
        key = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
        break;
      }
      case "monthly":
        key = date.toISOString().slice(0, 7);
        break;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(metric);
  });

  return groups;
};

const getWeek = (date: Date): number => {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

const formatPeriod = (periodKey: string, aggregation: AggregationLevel): string => {
  switch (aggregation) {
    case "hourly":
      return periodKey.replace("T", " ");
    case "daily":
      return periodKey;
    case "weekly":
      return periodKey;
    case "monthly": {
      const [year, month] = periodKey.split("-");
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  }
};

export const aggregateData = (data: CampaignData, aggregation: AggregationLevel): AggregatedData[] => {
  const { metrics } = data;

  const groupedMetrics = groupByTimePeriod(metrics, aggregation);

  const aggregatedData: AggregatedData[] = [];

  groupedMetrics.forEach((metricsInPeriod, periodKey) => {
    const campaignIds = new Set(metricsInPeriod.map((metric) => metric.campaignId));

    const aggregated: AggregatedData = {
      period: formatPeriod(periodKey, aggregation),
      periodStart: getPeriodStartDate(periodKey, aggregation),
      campaignsActive: Array.from(campaignIds),
      totalImpressions: metricsInPeriod.reduce((sum, metric) => sum + metric.impressions, 0),
      totalClicks: metricsInPeriod.reduce((sum, metric) => sum + metric.clicks, 0),
      totalRevenue: metricsInPeriod.reduce((sum, metric) => sum + metric.revenue, 0),
    };

    aggregatedData.push(aggregated);
  });

  return aggregatedData;
};

const getPeriodStartDate = (periodKey: string, aggregation: AggregationLevel): Date => {
  switch (aggregation) {
    case "hourly":
      return new Date(periodKey + ":00:00.000Z");
    case "daily":
      return new Date(periodKey + "T00:00:00.000Z");
    case "weekly": {
      const [year, week] = periodKey.split("-W");
      return new Date(parseInt(year), 0, (parseInt(week) - 1) * 7);
    }
    case "monthly":
      return new Date(periodKey + "-01T00:00:00.000Z");
    default:
      return new Date();
  }
};
