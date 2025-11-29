import type { Campaign, Dataset, JoinedMetric, Metric } from '../../types/data';


export async function fetchDataset(): Promise<Dataset> {
  const res = await fetch('/data.json');
  if (!res.ok) throw new Error(`Failed to fetch data.json: ${res.status}`);
  const json = await res.json();
  return { campaigns: json.campaigns as Campaign[], metrics: json.metrics as Metric[] };
}

export function joinMetricsWithCampaigns(dataset: Dataset): JoinedMetric[] {
  const map = new Map<string, Campaign>();
  for (const c of dataset.campaigns) map.set(c.id, c);
  return dataset.metrics.map((m) => ({ ...m, campaign: map.get(m.campaignId)! }));
}