import React, { useMemo, useState, useRef, useEffect } from 'react'

interface AggregatedRow {
    id: string
    date: string
    campaignsActive: number
    totalImpressions: number
    totalClicks: number
    totalRevenue: number
}

type Metric = 'totalClicks' | 'totalRevenue'

interface Props {
    data: AggregatedRow[]
}

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
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 600, height: 350 })

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                setDimensions({ width: containerRef.current.clientWidth, height: 350 })
            }
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [data])

    const maxValue = useMemo(() => {
        const rawMax = Math.max(...sortedData.map(d => d[metric]), 1)
        return niceNumber(rawMax)
    }, [sortedData, metric])

    const points = useMemo(() => {
        if (!sortedData || sortedData.length === 0) return []

        const width = dimensions.width
        const height = dimensions.height
        const padding = 50

        return sortedData.map((d, i) => {
            const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding)
            const y = height - padding - (d[metric] / maxValue) * (height - 2 * padding)
            return { x, y, value: d[metric], label: d.date }
        })
    }, [sortedData, metric, dimensions, maxValue])

    const linePath = useMemo(() => {
        if (points.length === 0) return ''
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    }, [points])

    const yTicks = useMemo(() => {
        const step = maxValue / 4
        return [0, 1, 2, 3, 4].map(i => ({
            raw: Math.round(i * step),
            label: formatTick(Math.round(i * step)),
            y: dimensions.height - 50 - (i / 4) * (dimensions.height - 2 * 50),
        }))
    }, [maxValue, dimensions])

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <h2>Timeline Chart</h2>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => setMetric('totalClicks')}>Clicks</button>
                <button onClick={() => setMetric('totalRevenue')}>Revenue</button>
            </div>
            <svg width={dimensions.width} height={dimensions.height} style={{ border: '1px solid black' }}>
                <line
                    x1={50}
                    y1={dimensions.height - 50}
                    x2={dimensions.width - 50}
                    y2={dimensions.height - 50}
                    stroke="black"
                />
                <line x1={50} y1={dimensions.height - 50} x2={50} y2={20} stroke="black" />

                <path d={linePath} fill="none" stroke="blue" strokeWidth={2} />

                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={4} fill="red" />
                ))}

                {points.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={dimensions.height - 30}
                        textAnchor="middle"
                        fontSize={10}
                        transform={`rotate(45 ${p.x},${dimensions.height - 30})`}
                    >
                        {p.label}
                    </text>
                ))}

                {yTicks.map((tick, i) => (
                    <text key={i} x={10} y={tick.y + 5} fontSize={10}>
                        {tick.label}
                    </text>
                ))}
            </svg>
        </div>
    )
}

export default TimelineChart
