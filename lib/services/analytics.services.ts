import axios from "axios";
import {
  AggregatedData,
  Aggregation,
  CampaignItem,
  MetricItem,
  MetricWithCampaignItem,
} from "../interfaces/types";
import { joinCampaignsToMetrics } from "../functions/joinCampaignsToMetrics";
import { aggregationFunction } from "../functions/aggregationFunction";

export const getAnalytics = async (
  aggregationType: Aggregation
): Promise<AggregatedData[] | []> => {
  const { data } = await axios.get<{
    campaigns: CampaignItem[];
    metrics: MetricItem[];
  }>("/data/data.json");
  const { campaigns, metrics } = data;

  const joined: MetricWithCampaignItem[] = joinCampaignsToMetrics(
    metrics,
    campaigns
  );
  return aggregationFunction(joined, aggregationType);
};
