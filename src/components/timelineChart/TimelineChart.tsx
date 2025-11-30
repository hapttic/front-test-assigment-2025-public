import React, { useState } from 'react'
import { AggregatedRow, AggregationLevel, MetricType, ChartType } from '../../models/types'
import TimelineHeader from '../timelineHeader/TimelineHeader'
import Tooltip from '../tooltip/Tooltip'
import { useTimelineChartData } from '../../hooks/useTimelineChartData'
import './TimelineChart.css'

interface Props {
    data: AggregatedRow[]
    aggregation: AggregationLevel
}

const slotWidth = 120
const padding = 80
const chartHeight = 400
const barWidth = slotWidth * 0.7
const minChartWidth = 800

const TimelineChart: React.FC<Props> = ({ data }) => {
    const [metric, setMetric] = useState<MetricType>('totalClicks')
    const [chartType, setChartType] = useState<ChartType>('line')
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const { points, linePath, yTicks, svgMinWidth } = useTimelineChartData(
        data,
        metric,
        slotWidth,
        padding,
        chartHeight,
        minChartWidth
    )

    const renderGrid = () => (
        <>
            {yTicks.map((tick, i) => (
                <line key={i} x1={padding} y1={tick.y} x2={svgMinWidth - padding} y2={tick.y} stroke="#333" strokeWidth={1} />
            ))}
            {yTicks.map((tick, i) => (
                <text key={i} x={10} y={tick.y + 5} fontSize={16} fill="#888">{tick.label}</text>
            ))}
        </>
    )

    const renderBarsOrLine = () => points.map((p, i) => {
        if (chartType === 'line') {
            return (
                <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={6}
                    fill={hoveredIndex === i ? '#3858f7ff' : '#6079f7ff'}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                />
            )
        } else {
            return (
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
        }
    })

    const renderLabels = () => points.map((p, i) => (
        <text key={i} x={p.x} y={chartHeight - 15} textAnchor="middle" fontSize={14} fill="#bbb">
            {p.label.split(',')[0]}
        </text>
    ))

    return (
        <div className="timeline-container scrollable">
            <TimelineHeader
                metric={metric}
                setMetric={setMetric}
                chartType={chartType}
                setChartType={setChartType}
            />
            <div className="svg-wrapper" style={{ width: '100%', minWidth: svgMinWidth }}>
                <svg width="100%" height={chartHeight}>
                    {renderGrid()}
                    {chartType === 'line' && <path d={linePath} fill="none" stroke="#6079f7ff" strokeWidth={3} />}
                    {renderBarsOrLine()}
                    {renderLabels()}
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
    )
}

export default TimelineChart
