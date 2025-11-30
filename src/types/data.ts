export interface Campaign {
  id: string;
  name: string;
  platform: string;
}

export interface Metric {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface JoinedMetric extends Metric {
  campaign: Campaign;
}

export interface Dataset {
  campaigns: Campaign[];
  metrics: Metric[];
}


