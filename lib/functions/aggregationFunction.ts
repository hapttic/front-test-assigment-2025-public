import {
  AggregatedData,
  AnalyticsApiResponse,
  DataFilters,
  MetricWithCampaignItem,
} from "../interfaces/types";

export const aggregationFunction = (
  data: MetricWithCampaignItem[],
  filters: DataFilters
): AnalyticsApiResponse => {
  const result: AggregatedData[] = [];

  data.forEach((item) => {
    const date = new Date(item.timestamp);

    let timePeriod: string;
    if (filters.aggregationType == "hourly") {
      timePeriod = date.toISOString().slice(0, 13);
    } else if (filters.aggregationType == "daily") {
      timePeriod = date.toISOString().slice(0, 10);
    } else if (filters.aggregationType == "weekly") {
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

  // it was not requested but I am creating pagination for preventing heavy data load
  const total = result.length;
  let paginatedData = result;
  if (filters.pageNumber !== undefined && filters.pageSize !== undefined) {
    const start = (filters.pageNumber - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    paginatedData = result.slice(start, end);
  }
  return { data: paginatedData, total: total };
};
