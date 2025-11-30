import { useMemo } from 'react'
import { AggregatedRow, SortField, SortOrder } from '../models/types'

export const useSortedRows = (
    rows: AggregatedRow[],
    sortField: SortField,
    sortOrder: SortOrder
): AggregatedRow[] => {
    return useMemo(() => {
        return [...rows].sort((a, b) => {
            if (sortField === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime()
            }
            if (sortField === 'totalRevenue') {
                return sortOrder === 'asc'
                    ? a.totalRevenue - b.totalRevenue
                    : b.totalRevenue - a.totalRevenue
            }
            return 0
        })
    }, [rows, sortField, sortOrder])
}
