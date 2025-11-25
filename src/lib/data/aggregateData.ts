import { data } from "../../lib/data/data";
import type { AggregatedData, AggregationPeriod, Metric } from "../types";

export async function aggregateData(period: AggregationPeriod) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // fake delay for loading

  const metrics: Metric[] = data.metrics;
  const grouped = new Map<string, Metric[]>();

  metrics.forEach((metric) => {
    const timeStr = getTimeString(metric.timestamp, period);
    if (!grouped.has(timeStr)) {
      grouped.set(timeStr, []);
    }
    grouped.get(timeStr)!.push(metric);
  });

  const aggregated: AggregatedData[] = [];

  grouped.forEach((metricsInPeriod) => {
    const campaignIds = new Set(metricsInPeriod.map((m) => m.campaignId));

    const totalImpressions = metricsInPeriod.reduce(
      (sum, m) => sum + m.impressions,
      0
    );
    const totalClicks = metricsInPeriod.reduce((sum, m) => sum + m.clicks, 0);
    const totalRevenue = metricsInPeriod.reduce((sum, m) => sum + m.revenue, 0);

    aggregated.push({
      timestamp: metricsInPeriod[0].timestamp,
      campaignsActive: campaignIds.size,
      totalImpressions,
      totalClicks,
      totalRevenue,
    });
  });

  aggregated.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return aggregated;
}

function getTimeString(timestamp: string, period: AggregationPeriod): string {
  const date = new Date(timestamp);

  switch (period) {
    case "hourly":
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    case "daily":
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    case "weekly": {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      return `${monday.getFullYear()}-W${getWeekNumber(monday)}`;
    }
    case "monthly":
      return `${date.getFullYear()}-${date.getMonth()}`;
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
