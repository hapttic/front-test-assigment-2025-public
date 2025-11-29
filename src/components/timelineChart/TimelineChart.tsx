import React, { useMemo, useState } from 'react'
import { AggregatedRow } from '../../models/data'
import "./TimelineChart.css"

interface Props {
    data: AggregatedRow[]
}

type Metric = 'totalClicks' | 'totalRevenue'

const niceNumber = (value: number) => {
    const exponent = Math.floor(Math.log10(value))
    const fraction = value / Math.pow(10, exponent)
    let niceFraction
    if (fraction < 1.5) niceFraction = 1
    else if (fraction < 3) niceFraction = 2
    else if (fraction < 7) niceFraction = 5
    else niceFraction = 10
    return niceFraction * Math.pow(10, exponent)
}

const formatTick = (n: number) => {
    if (n >= 1_000_000) return `${n / 1_000_000}M`
    if (n >= 1_000) return `${n / 1000}K`
    return n.toString()
}

const TimelineChart: React.FC<Props> = ({ data }) => {
    const [metric, setMetric] = useState<Metric>('totalClicks')

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [data])

    const maxValue = useMemo(() => {
        const rawMax = Math.max(...sortedData.map(d => d[metric]), 1)
        return niceNumber(rawMax)
    }, [sortedData, metric])

    const points = useMemo(() => {
        const padding = 50
        const height = 350
        const widthPerPoint = 80

        return sortedData.map((d, i) => {
            const x = padding + (i / (sortedData.length - 1 || 1)) * ((sortedData.length - 1) * widthPerPoint)
            const y = height - padding - (d[metric] / maxValue) * (height - 2 * padding)
            return { x, y, value: d[metric], label: d.date }
        })
    }, [sortedData, metric, maxValue])

    const linePath = useMemo(() => {
        if (points.length === 0) return ''
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    }, [points])

    const yTicks = useMemo(() => {
        const step = maxValue / 4
        const height = 350
        return [0, 1, 2, 3, 4].map(i => ({
            raw: Math.round(i * step),
            label: formatTick(Math.round(i * step)),
            y: height - 50 - (i / 4) * (height - 100)
        }))
    }, [maxValue])

    const svgMinWidth = Math.max(points.length * 80, 0)

    return (
        <div className="timeline-container scrollable">
            <div className="chart-header">
                <h2 className="chart-title">Timeline Chart</h2>
                <div className="metric-buttons">
                    <button onClick={() => setMetric('totalClicks')}>Clicks</button>
                    <span> / </span>
                    <button onClick={() => setMetric('totalRevenue')}>Revenue</button>
                </div>
            </div>
            <div
                className="svg-wrapper"
                style={{ width: '100%', minWidth: svgMinWidth }}
            >
                <svg width="100%" height={350} style={{ background: "#222", borderRadius: "5px" }}>
                    <line
                        x1={50}
                        y1={350 - 50}
                        x2={svgMinWidth - 50}
                        y2={350 - 50}
                        stroke="#3a3a3a"
                    />
                    <line x1={50} y1={350 - 50} x2={50} y2={20} stroke="#3a3a3a" />

                    <path d={linePath} fill="none" stroke="grey" strokeWidth={2} />

                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={4} fill="white" />
                    ))}

                    {points.map((p, i) => (
                        <text
                            key={i}
                            x={p.x}
                            y={350 - 30}
                            textAnchor="middle"
                            fontSize={10}
                            fill="#ccc"
                            transform={`rotate(45 ${p.x},${350 - 30})`}
                        >
                            {p.label}
                        </text>
                    ))}

                    {yTicks.map((tick, i) => (
                        <text key={i} x={10} y={tick.y + 5} fontSize={10} fill="#ccc">
                            {tick.label}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    )
}

export default TimelineChart
