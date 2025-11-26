import axios from "axios";
import {
  AggregatedData,
  CampaignItem,
  DataFilters,
  MetricItem,
  MetricWithCampaignItem,
} from "../interfaces/types";
import { joinCampaignsToMetrics } from "../functions/joinCampaignsToMetrics";
import { aggregationFunction } from "../functions/aggregationFunction";

export const getAnalytics = async (
  filters: DataFilters
): Promise<AggregatedData[] | []> => {
  const { data } = await axios.get<{
    campaigns: CampaignItem[];
    metrics: MetricItem[];
  }>("/data/data.json");
  const { campaigns, metrics } = data;

  const joined: MetricWithCampaignItem[] = joinCampaignsToMetrics(
    filters,
    metrics,
    campaigns
  );
  return aggregationFunction(joined, filters.aggregationType);
};
