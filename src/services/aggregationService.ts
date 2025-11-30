import { Metric, AggregatedRow, AggregationLevel } from '../models/types'
import { formatDate } from '../utils/formatDate'

export const aggregateData = (metrics: Metric[], aggregation: AggregationLevel): AggregatedRow[] => {
    const map = new Map<string, { row: AggregatedRow, ts: number }>()
    metrics.forEach(item => {
        const key = formatDate(item.timestamp, aggregation)
        const ts = new Date(item.timestamp).getTime()
        if (!map.has(key)) {
            map.set(key, {
                row: {
                    id: key,
                    date: key,
                    campaignsActive: 1,
                    totalImpressions: item.impressions,
                    totalClicks: item.clicks,
                    totalRevenue: item.revenue
                },
                ts
            })
        } else {
            const entry = map.get(key)!
            entry.row.campaignsActive += 1
            entry.row.totalImpressions += item.impressions
            entry.row.totalClicks += item.clicks
            entry.row.totalRevenue += item.revenue
        }
    })
    return Array.from(map.values()).map(e => ({ ...e.row, __ts: e.ts }))
}

export const sortAggregatedRows = (
    rows: AggregatedRow[],
    sortField: 'date' | 'totalRevenue',
    sortOrder: 'asc' | 'desc'
): AggregatedRow[] => {
    return [...rows].sort((a, b) => {
        if (sortField === 'date') {
            return sortOrder === 'asc' ? (a as any).__ts - (b as any).__ts : (b as any).__ts - (a as any).__ts
        }
        if (sortField === 'totalRevenue') {
            return sortOrder === 'asc' ? a.totalRevenue - b.totalRevenue : b.totalRevenue - a.totalRevenue
        }
        return 0
    })
}
