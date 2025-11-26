import './StatsGrid.css'

export default function StatsGrid({ data }) {
    const totalImpressions = data.metrics.reduce((a, m) => a + m.impressions, 0)
    const totalClicks = data.metrics.reduce((a, m) => a + m.clicks, 0)
    const totalRevenue = data.metrics.reduce((a, m) => a + m.revenue, 0)
    const ctr = totalImpressions ? totalClicks / totalImpressions : 0

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Impressions</h3>
                <p>{totalImpressions}</p>
            </div>
            <div className="stat-card">
                <h3>Clicks</h3>
                <p>{totalClicks}</p>
            </div>
            <div className="stat-card">
                <h3>Revenue</h3>
                <p>${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="stat-card">
                <h3>CTR</h3>
                <p>{(ctr * 100).toFixed(2)}%</p>
            </div>
        </div>
    )
}
