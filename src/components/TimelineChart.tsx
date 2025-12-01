/**
 * TimelineChart Component
 * 
 * Custom SVG bar chart for displaying campaign metrics over time.
 * Built from scratch without chart libraries to demonstrate SVG mastery.
 * 
 * Features:
 * - Dynamic scaling based on data range
 * - Automatic axis calculation
 * - Interactive hover effects
 * - Responsive design
 * - Clean, professional styling
 */

import { useMemo } from 'react';
import type { AggregatedDataPoint, AggregationLevel, ChartMetric } from '../types';
import { formatDate } from '../utils/aggregation';

interface TimelineChartProps {
  data: AggregatedDataPoint[];
  aggregationLevel: AggregationLevel;
  metric: ChartMetric;
}

export function TimelineChart({ data, aggregationLevel, metric }: TimelineChartProps) {
  /**
   * Chart dimensions and padding
   */
  const width = 1000;
  const height = 400;
  const padding = { top: 20, right: 40, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  /**
   * Extract the metric values from data
   */
  const values = useMemo(() => {
    return data.map((d) => (metric === 'Clicks' ? d.totalClicks : d.totalRevenue));
  }, [data, metric]);

  /**
   * Calculate Y-axis scale
   */
  const { maxValue, yAxisTicks } = useMemo(() => {
    if (values.length === 0) return { maxValue: 0, yAxisTicks: [] };

    const max = Math.max(...values);
    const niceMax = Math.ceil(max * 1.1); // Add 10% padding to top
    
    // Generate 5 evenly spaced ticks
    const tickCount = 5;
    const tickStep = niceMax / (tickCount - 1);
    const ticks = Array.from({ length: tickCount }, (_, i) => Math.round(i * tickStep));
    
    return { maxValue: niceMax, yAxisTicks: ticks };
  }, [values]);

  /**
   * Calculate bar width and spacing
   */
  const barSpacing = 2;
  const barWidth = Math.max(2, (chartWidth - (data.length - 1) * barSpacing) / data.length);

  /**
   * Scale value to Y coordinate
   */
  const scaleY = (value: number): number => {
    if (maxValue === 0) return chartHeight;
    return chartHeight - (value / maxValue) * chartHeight;
  };

  /**
   * Format value for display
   */
  const formatValue = (value: number): string => {
    if (metric === 'Revenue') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString('en-US');
  };

  /**
   * Format Y-axis labels
   */
  const formatYAxisLabel = (value: number): string => {
    if (metric === 'Revenue') {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  /**
   * Get X-axis labels (show subset for readability)
   */
  const getXAxisLabels = (): Array<{ index: number; label: string }> => {
    if (data.length === 0) return [];
    
    // Determine how many labels to show based on data size
    const maxLabels = 12;
    const step = Math.max(1, Math.floor(data.length / maxLabels));
    
    const labels: Array<{ index: number; label: string }> = [];
    for (let i = 0; i < data.length; i += step) {
      labels.push({
        index: i,
        label: formatDate(data[i].date, aggregationLevel),
      });
    }
    
    // Always include the last point if not already included
    if (labels[labels.length - 1]?.index !== data.length - 1) {
      labels.push({
        index: data.length - 1,
        label: formatDate(data[data.length - 1].date, aggregationLevel),
      });
    }
    
    return labels;
  };

  const xAxisLabels = useMemo(() => getXAxisLabels(), [data, aggregationLevel]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available for chart
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        {/* Chart Title */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          {metric} Over Time ({aggregationLevel})
        </text>

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#9CA3AF"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#9CA3AF"
          strokeWidth="2"
        />

        {/* Y-axis ticks and labels */}
        {yAxisTicks.map((tick) => {
          const y = padding.top + scaleY(tick);
          return (
            <g key={tick}>
              {/* Grid line */}
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4"
              />
              {/* Tick mark */}
              <line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              {/* Label */}
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {formatYAxisLabel(tick)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((point, index) => {
          const value = values[index];
          const x = padding.left + index * (barWidth + barSpacing);
          const y = padding.top + scaleY(value);
          const barHeight = chartHeight - scaleY(value);

          return (
            <g key={point.date}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                className="fill-blue-500 hover:fill-blue-600 transition-colors cursor-pointer"
              >
                <title>
                  {formatDate(point.date, aggregationLevel)}
                  {'\n'}
                  {metric}: {formatValue(value)}
                </title>
              </rect>
            </g>
          );
        })}

        {/* X-axis labels */}
        {xAxisLabels.map(({ index, label }) => {
          const x = padding.left + index * (barWidth + barSpacing) + barWidth / 2;
          const y = padding.top + chartHeight + 15;

          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              className="text-xs fill-gray-600"
              transform={`rotate(-45, ${x}, ${y})`}
            >
              {label}
            </text>
          );
        })}

        {/* Y-axis label */}
        <text
          x={-height / 2}
          y={20}
          textAnchor="middle"
          transform={`rotate(-90, 20, ${height / 2})`}
          className="text-sm font-medium fill-gray-700"
        >
          {metric}
        </text>

        {/* X-axis label */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="text-sm font-medium fill-gray-700"
        >
          Time Period
        </text>
      </svg>
    </div>
  );
}
