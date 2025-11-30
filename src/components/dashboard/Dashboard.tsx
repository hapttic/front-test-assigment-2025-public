import React, { useState, useEffect, useMemo } from 'react'
import { fetchData, MergedCampaignMetric } from '../../services/dataService'
import TimelineChart from '../timelineChart/TimelineChart'
import DashboardTable from '../dashboardTable/DashboardTable'
import Loader from '../loader/Loader'
import { AggregatedRow, SortField, SortOrder, AggregationLevel } from '../../models/types'
import Header from '../header/Header'
import "./Dashboard.css"

const Dashboard: React.FC = () => {
  const [data, setData] = useState<MergedCampaignMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [aggregation, setAggregation] = useState<AggregationLevel>('daily')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  useEffect(() => {
    async function load() {
      const merged = await fetchData()
      setData(merged)
      setLoading(false)
    }
    load()
  }, [])

  const aggregatedRows: AggregatedRow[] = useMemo(() => {
    const map = new Map<string, { row: AggregatedRow, ts: number }>()
    const formatDate = (ts: string): string => {
      const d = new Date(ts)
      if (aggregation === 'hourly') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getHours().toString().padStart(2, '0')}:00, ${weekdays[d.getDay()]}, ${d.getFullYear()}`
      }
      if (aggregation === 'daily') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })}, ${weekdays[d.getDay()]}, ${d.getFullYear()}`
      }
      if (aggregation === 'weekly') {
        const d0 = new Date(d)
        const day = d0.getDay() || 7
        d0.setDate(d0.getDate() - day + 1)
        d0.setHours(0, 0, 0, 0)
        return `${d0.getDate().toString().padStart(2, '0')} ${d0.toLocaleString('default', { month: 'short' })}, ${d0.getFullYear()}`
      }
      if (aggregation === 'monthly') {
        return `${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
      }
      return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
    }

    data.forEach(item => {
      const key = formatDate(item.timestamp)
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
  }, [data, aggregation])

  const sortedRows = useMemo(() => {
    return [...aggregatedRows].sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'asc' ? (a as any).__ts - (b as any).__ts : (b as any).__ts - (a as any).__ts
      }
      if (sortField === 'totalRevenue') {
        return sortOrder === 'asc' ? a.totalRevenue - b.totalRevenue : b.totalRevenue - a.totalRevenue
      }
      return 0
    })
  }, [aggregatedRows, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  if (loading) return <Loader loading={loading} />

  return (
    <div>
      <Header aggregation={aggregation} setAggregation={setAggregation} />
      <div className="dashboard">
        <TimelineChart data={aggregatedRows} aggregation={aggregation} />
        <DashboardTable
          rows={sortedRows}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>
    </div>
  )
}

export default Dashboard
