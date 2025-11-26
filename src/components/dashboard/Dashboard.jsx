import { useState } from 'react'
import data from '../../data/data.json'
import Header from '../header/Header'
import StatsGrid from '../statsGrid/StatsGrid'
import ChartSection from '../chartSection/ChartSection'
import CampaignTable from '../campaignTable/CampaignTable'
import './Dashboard.css'

export default function Dashboard() {
    const [filters, setFilters] = useState({
        selectedPlatform: 'All',
        selectedCampaign: 'All',
        startDate: '',
        endDate: ''
    })

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    const filteredMetrics = data.metrics.filter(m => {
        const campaign = data.campaigns.find(c => c.id === m.campaignId)
        if (!campaign) return false
        if (filters.selectedPlatform !== 'All' && campaign.platform !== filters.selectedPlatform) return false
        if (filters.selectedCampaign !== 'All' && campaign.name !== filters.selectedCampaign) return false
        if (filters.startDate && new Date(m.timestamp) < new Date(filters.startDate)) return false
        if (filters.endDate && new Date(m.timestamp) > new Date(filters.endDate)) return false
        return true
    })

    const filteredData = {
        campaigns: data.campaigns,
        metrics: filteredMetrics
    }

    return (
        <div className="dashboard-container">
            <Header data={data} onFilterChange={handleFilterChange} />
            <StatsGrid data={filteredData} />
            <ChartSection data={filteredData} />
            <CampaignTable data={filteredData} />
        </div>
    )
}
