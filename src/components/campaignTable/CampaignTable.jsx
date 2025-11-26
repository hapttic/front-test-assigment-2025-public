import './CampaignTable.css'

export default function CampaignTable({ data }) {
    const aggregated = data.campaigns.map(c => {
        const entries = data.metrics.filter(m => m.campaignId === c.id)
        const impressions = entries.reduce((a, e) => a + e.impressions, 0)
        const clicks = entries.reduce((a, e) => a + e.clicks, 0)
        const revenue = entries.reduce((a, e) => a + e.revenue, 0)
        const lastTimestamp = entries[entries.length - 1]?.timestamp || ''
        const ctr = impressions ? clicks / impressions : 0
        return { name: c.name, platform: c.platform, impressions, clicks, revenue, ctr, lastTimestamp }
    })

    return (
        <div className="campaign-table">
            <h2>Campaign Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Platform</th>
                        <th>Impressions</th>
                        <th>Clicks</th>
                        <th>Revenue</th>
                        <th>CTR</th>
                        <th>Last Update</th>
                    </tr>
                </thead>
                <tbody>
                    {aggregated.map((c, i) => (
                        <tr key={i}>
                            <td>{c.name}</td>
                            <td>{c.platform}</td>
                            <td>{c.impressions}</td>
                            <td>{c.clicks}</td>
                            <td>${c.revenue.toFixed(2)}</td>
                            <td>{(c.ctrs * 100).toFixed(2)}%</td>
                            <td>{c.lastTimestamp ? new Date(c.lastTimestamp).toLocaleTimeString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
