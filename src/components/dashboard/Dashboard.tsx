import React, { useState, useEffect } from 'react'
import dataJson from '../../data/data.json'

interface Campaign {
  id: string
  name: string
  platform: string
}

interface Metric {
  campaignId: string
  timestamp: string
  impressions: number
  clicks: number
  revenue: number
}

interface Data {
  metadata: {
    generatedAt: string
    description: string
  }
  campaigns: Campaign[]
  metrics: Metric[]
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    // Simulate fetching data
    setData(dataJson as Data)
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Campaigns:</h2>
      <ul>
        {data.campaigns.map((c) => (
          <li key={c.id}>
            {c.name} ({c.platform})
          </li>
        ))}
      </ul>

      <h2>Metrics:</h2>
      <ul>
        {data.metrics.map((m, index) => (
          <li key={index}>
            {m.campaignId} - Impressions: {m.impressions}, Clicks: {m.clicks}, Revenue: ${m.revenue}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
