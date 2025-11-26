import axios from "axios";
import {
  AnalyticsApiResponse,
  CampaignItem,
  DataFilters,
  MetricItem,
  MetricWithCampaignItem,
} from "../interfaces/types";
import { joinCampaignsToMetrics } from "../functions/joinCampaignsToMetrics";
import { aggregationFunction } from "../functions/aggregationFunction";

export const getAnalytics = async (
  filters: DataFilters
): Promise<AnalyticsApiResponse | []> => {
  const { data } = await axios.get<{
    campaigns: CampaignItem[];
    metrics: MetricItem[];
  }>("/data/data.json");
  const { campaigns, metrics } = data;

  const joined: MetricWithCampaignItem[] = joinCampaignsToMetrics(
    metrics,
    campaigns
  );
  return aggregationFunction(joined, filters);
};
