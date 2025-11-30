import React, { useMemo, useState } from 'react'
import { AggregatedRow, AggregationLevel } from '../../models/types'
import "./TimelineChart.css"
import TimelineHeader from '../timelineHeader/TimelineHeader'
import { MetricType, ChartType } from '../../models/types'
import Tooltip from '../tooltip/Tooltip'

interface Props {
    data: AggregatedRow[]
    aggregation: AggregationLevel
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
    const [metric, setMetric] = useState<MetricType>('totalClicks')
    const [chartType, setChartType] = useState<ChartType>('line')
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const sortedData = useMemo(() => [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [data])

    const maxValue = useMemo(() => {
        const rawMax = Math.max(...sortedData.map(d => d[metric]), 1)
        return niceNumber(rawMax)
    }, [sortedData, metric])

    const slotWidth = 120
    const padding = 80
    const chartHeight = 400
    const barWidth = slotWidth * 0.7
    const minChartWidth = 800

    const xOffset = padding + 40

    const points = useMemo(() => sortedData.map((d, i) => {
        const x = xOffset + i * slotWidth
        const y = chartHeight - padding - (d[metric] / maxValue) * (chartHeight - 2 * padding)
        return { x, y, value: d[metric], label: d.date }
    }), [sortedData, metric, maxValue])

    const linePath = useMemo(() => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '), [points])

    const yTicks = useMemo(() => {
        const step = maxValue / 4
        return [0, 1, 2, 3, 4].map(i => ({
            raw: Math.round(i * step),
            label: formatTick(Math.round(i * step)),
            y: chartHeight - padding - (i / 4) * (chartHeight - 2 * padding)
        }))
    }, [maxValue])

    const svgMinWidth = Math.max(points.length * slotWidth + xOffset, minChartWidth)

    return (
        <>
            <div className="timeline-container scrollable">
                <TimelineHeader metric={metric} setMetric={setMetric} chartType={chartType} setChartType={setChartType} />
                <div className="svg-wrapper" style={{ width: '100%', minWidth: svgMinWidth }}>
                    <svg width="100%" height={chartHeight}>
                        {yTicks.map((tick, i) => (
                            <line key={i} x1={padding} y1={tick.y} x2={svgMinWidth - padding} y2={tick.y} stroke="#333" strokeWidth={1} />
                        ))}
                        {yTicks.map((tick, i) => (
                            <text key={i} x={10} y={tick.y + 5} fontSize={16} fill="#888">{tick.label}</text>
                        ))}
                        {chartType === 'line' && <path d={linePath} fill="none" stroke="#6079f7ff" strokeWidth={3} />}
                        {points.map((p, i) => (
                            chartType === 'line' ? (
                                <circle
                                    key={i}
                                    cx={p.x} cy={p.y} r={6}
                                    fill={hoveredIndex === i ? '#3858f7ff' : '#6079f7ff'}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                />
                            ) : (
                                <path
                                    key={i}
                                    d={`
                M ${p.x - barWidth / 2} ${chartHeight - padding} 
                L ${p.x - barWidth / 2} ${p.y + 8} 
                Q ${p.x - barWidth / 2} ${p.y} ${p.x - barWidth / 2 + 8} ${p.y} 
                L ${p.x + barWidth / 2 - 8} ${p.y} 
                Q ${p.x + barWidth / 2} ${p.y} ${p.x + barWidth / 2} ${p.y + 8} 
                L ${p.x + barWidth / 2} ${chartHeight - padding} 
                Z
            `}
                                    fill={hoveredIndex === i ? '#6079f7ff' : '#3858f7ff'}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                />
                            )
                        ))}
                        {points.map((p, i) => (
                            <text key={i} x={p.x} y={chartHeight - 15} textAnchor="middle" fontSize={14} fill="#bbb">
                                {p.label.split(',')[0]}
                            </text>
                        ))}
                        {hoveredIndex !== null && (
                            <Tooltip
                                x={points[hoveredIndex].x}
                                value={points[hoveredIndex].value}
                                label={points[hoveredIndex].label}
                                metric={metric}
                            />
                        )}
                    </svg>
                </div>
            </div>
        </>
    )
}

export default TimelineChart
