export interface Campaign {
    id: string
    name: string
    platform: string
}

export interface Metric {
    campaignId: string
    timestamp: string
    impressions: number
    clicks: number
    revenue: number
}

export interface Data {
    metadata: {
        generatedAt: string
        description: string
    }
    campaigns: Campaign[]
    metrics: Metric[]
}

export interface AggregatedRow {
    id: string
    date: string
    campaignsActive: number
    totalImpressions: number
    totalClicks: number
    totalRevenue: number
}

export type SortField = 'date' | 'totalRevenue'
export type SortOrder = 'asc' | 'desc'

export type AggregationLevel = 'hourly' | 'daily' | 'weekly' | 'monthly'