import React from 'react'
import { MetricType } from '../../models/types'

interface TooltipProps {
    x: number
    value: number
    label: string
    metric: MetricType
}

const Tooltip: React.FC<TooltipProps> = ({ x, value, label, metric }) => {
    const paddingY = 12
    const lineHeight = 22
    const rectWidth = 180
    const rectHeight = paddingY * 2 + lineHeight * 2
    const tooltipTopY = 20
    const rectX = x - rectWidth / 2
    const rectY = tooltipTopY

    const valueColor = metric === 'totalRevenue' ? '#22c55e' : '#4da6ff'
    const displayValue = metric === 'totalRevenue' ? `$${value.toFixed(0)}` : value.toFixed(0)
    const metricLabel = metric === 'totalRevenue' ? 'Revenue' : 'Clicks'

    return (
        <g style={{ pointerEvents: 'none' }}>
            <rect
                x={rectX}
                y={rectY}
                width={rectWidth}
                height={rectHeight}
                fill="#1f2937"
                rx={8}
                stroke="#4da6ff"
                strokeWidth={1.5}
            />
            <text
                x={x}
                y={rectY + paddingY + lineHeight / 1.5}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
            >
                <tspan fill={valueColor}>{displayValue}</tspan>
                <tspan fill="#fff"> {metricLabel}</tspan>
            </text>
            <text
                x={x}
                y={rectY + paddingY + lineHeight + lineHeight / 1.2}
                textAnchor="middle"
                fontSize={14}
                fill="#ddd"
            >
                {label}
            </text>
        </g>
    )
}

export default Tooltip
