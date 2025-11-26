import { Aggregation, MetricWithCampaignItem } from "../interfaces/types";

export const aggregationFunction = (
  data: MetricWithCampaignItem[],
  aggregationType: Aggregation
) => {
  console.log(data, aggregationType);
  return [];
};
