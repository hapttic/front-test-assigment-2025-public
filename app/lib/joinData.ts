import { Campaign, MetricPoint, JoinedMetric } from "./types";

export function joinData(
  campaigns: Campaign[],
  metrics: MetricPoint[]
): JoinedMetric[] {
  
  const map = new Map(campaigns.map(c => [c.id, c]));

  return metrics.map(m => {
    const c = map.get(m.campaignId);

    return {
      ...m,
      campaignName: c?.name ?? "Unknown",
      platform: c?.platform ?? "Unknown"
    };
  });
}
