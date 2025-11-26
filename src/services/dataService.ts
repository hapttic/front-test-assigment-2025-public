import { Metric, Campaign } from "../models/data"


export interface MergedCampaignMetric extends Campaign, Metric { }

export async function fetchData(): Promise<MergedCampaignMetric[]> {
    try {
        const res = await fetch("/data/data.json");
        if (!res.ok) throw new Error("Failed to fetch data.json");
        const data: { campaigns: Campaign[]; metrics: Metric[] } = await res.json();

        const merged: MergedCampaignMetric[] = data.metrics.map(metric => {
            const campaign = data.campaigns.find(c => c.id === metric.campaignId);
            if (!campaign) return { ...metric } as MergedCampaignMetric;
            return { ...campaign, ...metric };
        });

        return merged;
    } catch (err) {
        console.error("Error fetching campaign data:", err);
        return [];
    }
}
