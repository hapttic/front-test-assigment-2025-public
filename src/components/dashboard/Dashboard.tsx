import React, { useState, useEffect, useMemo } from 'react'
import { fetchData } from '../../services/dataService'
import { aggregateData } from '../../services/aggregationService'
import TimelineChart from '../timelineChart/TimelineChart'
import DashboardTable from '../dashboardTable/DashboardTable'
import Loader from '../loader/Loader'
import { AggregatedRow, SortField, SortOrder, AggregationLevel } from '../../models/types'
import Header from '../header/Header'
import { useSortedRows } from '../../hooks/useSortedRows'
import "./Dashboard.css"

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([])
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
    return aggregateData(data, aggregation)
  }, [data, aggregation])

  const sortedRows: AggregatedRow[] = useSortedRows(aggregatedRows, sortField, sortOrder)

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
