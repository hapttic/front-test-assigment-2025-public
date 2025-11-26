import {
  CampaignItem,
  DataFilters,
  MetricItem,
  MetricWithCampaignItem,
} from "../interfaces/types";

export const joinCampaignsToMetrics = (
  filters: DataFilters,
  metrics: MetricItem[],
  campaigns: CampaignItem[]
): MetricWithCampaignItem[] => {
  const campaignMap = new Map(campaigns.map((c) => [c.id, c]));

  return metrics.map((metric) => {
    const campaign = campaignMap.get(metric.campaignId);
    if (!campaign) {
      throw new Error(
        `campaign not found for this campaign id ${metric.campaignId}`
      );
    }

    return {
      ...metric,
      campaignName: campaign.name,
      campaignPlatform: campaign.platform,
    };
  });
};
