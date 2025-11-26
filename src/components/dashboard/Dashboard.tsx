import React, { useState, useEffect } from 'react'
import { fetchData, MergedCampaignMetric } from '../../services/dataService'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<MergedCampaignMetric[]>([])

  useEffect(() => {
    async function loadData() {
      const mergedData = await fetchData()
      setData(mergedData)
    }

    loadData()
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Dashboard
