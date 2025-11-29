import React, { useState, useEffect, useMemo } from 'react'
import { fetchData, MergedCampaignMetric } from '../../services/dataService'
import TimelineChart from '../timelineChart/TimelineChart'
import DashboardTable from '../dashboardTable/DashboardTable'
import { AggregatedRow, SortField, SortOrder, AggregationLevel } from '../../models/data'
import Header from '../header/Header'
import "./Dashboard.css"


const Dashboard: React.FC = () => {
  const [data, setData] = useState<MergedCampaignMetric[]>([])
  const [aggregation, setAggregation] = useState<AggregationLevel>('daily')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  useEffect(() => {
    async function load() {
      const merged = await fetchData()
      setData(merged)
    }
    load()
  }, [])

  const aggregatedRows: AggregatedRow[] = useMemo(() => {
    const map = new Map<string, AggregatedRow>()

    const formatDate = (ts: string): string => {
      const d = new Date(ts)

      if (aggregation === 'hourly') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getHours().toString().padStart(2, '0')}:00, ${weekdays[d.getDay()]}`
      }
      if (aggregation === 'daily') {
        return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`
      }
      if (aggregation === 'weekly') {
        const d0 = new Date(d)
        const day = d0.getDay() || 7
        d0.setDate(d0.getDate() - day + 1)
        d0.setHours(0, 0, 0, 0)
        return `${d0.getDate().toString().padStart(2, '0')} ${d0.toLocaleString('default', { month: 'short' })} ${d0.getFullYear()}`
      }
      if (aggregation === 'monthly') {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      }
      return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`
    }


    data.forEach(item => {
      const key = formatDate(item.timestamp)

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          date: key,
          campaignsActive: 1,
          totalImpressions: item.impressions,
          totalClicks: item.clicks,
          totalRevenue: item.revenue
        })
      } else {
        const row = map.get(key)!
        row.campaignsActive += 1
        row.totalImpressions += item.impressions
        row.totalClicks += item.clicks
        row.totalRevenue += item.revenue
      }
    })

    const rows = Array.from(map.values())
    return rows.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [data, aggregation])

  const sortedRows = useMemo(() => {
    return [...aggregatedRows].sort((a, b) => {
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
  }, [aggregatedRows, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div>

      <Header aggregation={aggregation} setAggregation={setAggregation} />
      <div className="dashboard">
        <TimelineChart data={aggregatedRows} />

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
