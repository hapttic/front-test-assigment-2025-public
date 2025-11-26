import {
  AggregatedData,
  Aggregation,
  MetricWithCampaignItem,
} from "../interfaces/types";

export const aggregationFunction = (
  data: MetricWithCampaignItem[],
  aggregationType: Aggregation
): AggregatedData[] | [] => {
  const result: AggregatedData[] = [];

  data.forEach((item) => {
    const date = new Date(item.timestamp);

    let timePeriod: string;
    if (aggregationType == "hourly") {
      timePeriod = date.toISOString().slice(0, 13);
    } else if (aggregationType == "daily") {
      timePeriod = date.toISOString().slice(0, 10);
    } else if (aggregationType == "weekly") {
      const week = Math.ceil(
        ((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
          (1000 * 60 * 60 * 24) +
          1) /
          7
      );
      timePeriod = `${date.getFullYear()}-W${week}`;
    } else {
      //monthly
      timePeriod = date.toISOString().slice(0, 7);
    }

    const entry = result.find((r) => r.period === timePeriod);
    if (entry) {
      entry.totalImpressions += item.impressions;
      entry.totalClicks += item.clicks;
      entry.totalRevenue += item.revenue;
      const campaignIds = new Set([
        ...Array.from({ length: entry.campaignsActive }, (_, i) => i),
        item.campaignId,
      ]);
      entry.campaignsActive = campaignIds.size;
    } else {
      result.push({
        period: timePeriod,
        totalImpressions: item.impressions,
        totalClicks: item.clicks,
        totalRevenue: item.revenue,
        campaignsActive: 1,
      });
    }
  });

  return result;
};
