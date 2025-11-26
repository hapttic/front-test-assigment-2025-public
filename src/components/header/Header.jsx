import { useState } from 'react'
import './Header.css'

export default function Header({ data, onFilterChange }) {
    const platforms = [...new Set(data.campaigns.map(c => c.platform))]
    const campaigns = data.campaigns
    const [selectedPlatform, setSelectedPlatform] = useState('All')
    const [selectedCampaign, setSelectedCampaign] = useState('All')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleChange = () => {
        onFilterChange({ selectedPlatform, selectedCampaign, startDate, endDate })
    }

    return (
        <div className="header">
            <h1>Campaign Analytics Dashboard</h1>
            <div className="filters">
                <select value={selectedPlatform} onChange={e => { setSelectedPlatform(e.target.value); handleChange() }}>
                    <option>All</option>
                    {platforms.map((p, i) => <option key={i}>{p}</option>)}
                </select>
                <select value={selectedCampaign} onChange={e => { setSelectedCampaign(e.target.value); handleChange() }}>
                    <option>All</option>
                    {campaigns.map((c, i) => <option key={i}>{c.name}</option>)}
                </select>
                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); handleChange() }} />
                <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); handleChange() }} />
            </div>
        </div>
    )
}
