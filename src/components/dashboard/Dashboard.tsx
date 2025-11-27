import React, { useState, useEffect, useMemo } from 'react'
import { fetchData, MergedCampaignMetric } from '../../services/dataService'
import TimelineChart from '../timelineChart/TimelineChart'
import DashboardTable from '../dashboardTable/DashboardTable'
import { AggregatedRow, SortField, SortOrder } from "../../models/data"

const Dashboard: React.FC = () => {
  const [data, setData] = useState<MergedCampaignMetric[]>([])
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  useEffect(() => {
    const load = async () => {
      const merged = await fetchData()
      setData(merged)
    }
    load()
  }, [])

  const aggregatedRows: AggregatedRow[] = useMemo(() => {
    const map = new Map<string, AggregatedRow>()

    data.forEach((item: MergedCampaignMetric) => {
      const date = new Date(item.timestamp).toLocaleDateString()

      if (!map.has(date)) {
        map.set(date, {
          id: date,
          date,
          campaignsActive: 1,
          totalImpressions: item.impressions,
          totalClicks: item.clicks,
          totalRevenue: item.revenue,
        })
      } else {
        const row = map.get(date)!
        row.campaignsActive += 1
        row.totalImpressions += item.impressions
        row.totalClicks += item.clicks
        row.totalRevenue += item.revenue
      }
    })

    const rows = Array.from(map.values())

    return rows.sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return sortOrder === 'asc'
        ? a.totalRevenue - b.totalRevenue
        : b.totalRevenue - a.totalRevenue
    })
  }, [data, sortField, sortOrder])

  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div>
      <h1>Campaign Dashboard</h1>

      <TimelineChart data={aggregatedRows} />

      <DashboardTable
        rows={aggregatedRows}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  )
}

export default Dashboard
