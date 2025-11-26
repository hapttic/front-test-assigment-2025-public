import './ChartSection.css'

export default function ChartSection({ data }) {
    const sorted = [...data.metrics].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    )

    const maxImpressions = Math.max(...sorted.map(m => m.impressions), 100)
    const width = 600
    const height = 200
    const padding = 40

    const points = sorted.map((m, i) => {
        const x = padding + (i * (width - padding * 2)) / (sorted.length - 1)
        const y = height - padding - ((m.impressions / maxImpressions) * (height - padding * 2))
        return [x, y]
    })

    const path = points.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ')

    return (
        <div className="chart-section">
            <h2>Impressions Over Time</h2>
            <svg width={width} height={height}>
                <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points={points.map(p => p.join(',')).join(' ')}
                />
                {points.map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#3b82f6" />
                ))}
            </svg>
        </div>
    )
}
