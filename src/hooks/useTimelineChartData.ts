import { useMemo } from 'react'
import { AggregatedRow, MetricType, TimelinePoint, TimelineChartData } from '../models/types'
import { niceNumber } from '../utils/numbers'

export const useTimelineChartData = (
    data: AggregatedRow[],
    metric: MetricType,
    slotWidth: number,
    padding: number,
    chartHeight: number,
    minChartWidth: number
): TimelineChartData => {
    const sortedData = useMemo(() => [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [data])
    const maxValue = useMemo(() => niceNumber(Math.max(...sortedData.map(d => d[metric] ?? 0), 1)), [sortedData, metric])
    const xOffset = padding + 40
    const points: TimelinePoint[] = useMemo(() => sortedData.map((d, i) => ({
        x: xOffset + i * slotWidth,
        y: chartHeight - padding - ((d[metric] ?? 0) / maxValue) * (chartHeight - 2 * padding),
        value: d[metric] ?? 0,
        label: d.date
    })), [sortedData, metric, maxValue, xOffset, chartHeight, padding, slotWidth])
    const linePath = useMemo(() => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '), [points])
    const yTicks = useMemo(() => {
        const step = maxValue / 4
        return [0, 1, 2, 3, 4].map(i => ({
            raw: Math.round(i * step),
            label: i * step >= 1000 ? `${i * step / 1000}K` : `${Math.round(i * step)}`,
            y: chartHeight - padding - (i / 4) * (chartHeight - 2 * padding)
        }))
    }, [maxValue, chartHeight, padding])
    const svgMinWidth = useMemo(() => Math.max(points.length * slotWidth + xOffset, minChartWidth), [points, slotWidth, xOffset, minChartWidth])

    return { points, linePath, yTicks, maxValue, svgMinWidth }
}
