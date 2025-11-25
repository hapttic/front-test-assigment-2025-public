import { useMemo } from 'react';
import type { AggregatedDataPoint } from '../types';
import './Chart.css';

interface ChartProps {
  data: AggregatedDataPoint[];
  metric: 'revenue' | 'clicks' | 'impressions';
}

export function Chart({ data, metric }: ChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    // Chart dimensions
    const width = 900;
    const height = 400;
    const padding = { top: 20, right: 20, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Get values based on metric
    const values = data.map((d) => {
      switch (metric) {
        case 'revenue':
          return d.totalRevenue;
        case 'clicks':
          return d.totalClicks;
        case 'impressions':
          return d.totalImpressions;
      }
    });

    // Calculate scales
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue;
    const yMax = maxValue + valueRange * 0.1; // Add 10% padding
    const yMin = Math.max(0, minValue - valueRange * 0.1);

    // Scale functions
    const xScale = (index: number) => {
      return padding.left + (index / (data.length - 1)) * chartWidth;
    };

    const yScale = (value: number) => {
      return padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
    };

    // Generate line path
    const linePath = data
      .map((d, i) => {
        const x = xScale(i);
        const y = yScale(values[i] ?? 0);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

    // Generate area path (for fill under line)
    const areaPath = data.length > 0
      ? `${linePath} L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${xScale(0)} ${padding.top + chartHeight} Z`
      : '';

    // Generate Y-axis ticks
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks }, (_, i) => {
      return yMin + (i / (yTicks - 1)) * (yMax - yMin);
    });

    // Generate X-axis labels (show every nth label to avoid crowding)
    const xLabelsCount = Math.min(10, data.length);
    const xLabelStep = Math.floor(data.length / xLabelsCount);

    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      linePath,
      areaPath,
      yTicks: yTickValues,
      xScale,
      yScale,
      xLabelStep,
      values,
    };
  }, [data, metric]);

  if (!chartData || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">No data to display</div>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (metric === 'revenue') {
      return '$' + value.toFixed(0);
    }
    return value.toFixed(0);
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'revenue':
        return 'Revenue ($)';
      case 'clicks':
        return 'Clicks';
      case 'impressions':
        return 'Impressions';
    }
  };

  const axisColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary').trim();
  const gridColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--chart-grid').trim();
  const lineColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--chart-line').trim();
  const areaColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--chart-area').trim();

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{getMetricLabel()} Over Time</h3>
      </div>
      <svg
        width={chartData.width}
        height={chartData.height}
        viewBox={`0 0 ${chartData.width} ${chartData.height}`}
        className="chart-svg"
      >
        {/* Y-axis */}
        <line
          x1={chartData.padding.left}
          y1={chartData.padding.top}
          x2={chartData.padding.left}
          y2={chartData.padding.top + chartData.chartHeight}
          stroke={axisColor}
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={chartData.padding.left}
          y1={chartData.padding.top + chartData.chartHeight}
          x2={chartData.padding.left + chartData.chartWidth}
          y2={chartData.padding.top + chartData.chartHeight}
          stroke={axisColor}
          strokeWidth="2"
        />

        {/* Y-axis grid lines and labels */}
        {chartData.yTicks.map((tick, i) => {
          const y = chartData.yScale(tick);
          return (
            <g key={i}>
              <line
                x1={chartData.padding.left}
                y1={y}
                x2={chartData.padding.left + chartData.chartWidth}
                y2={y}
                stroke={gridColor}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={chartData.padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fill={axisColor}
                fontSize="12"
              >
                {formatValue(tick)}
              </text>
            </g>
          );
        })}

        {/* Area under line */}
        <path
          d={chartData.areaPath}
          fill={areaColor}
        />

        {/* Line */}
        <path
          d={chartData.linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = chartData.xScale(i);
          const y = chartData.yScale(chartData.values[i] ?? 0);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={lineColor}
              stroke="var(--bg-secondary)"
              strokeWidth="2"
            >
              <title>{`${d.periodLabel}: ${formatValue(chartData.values[i] ?? 0)}`}</title>
            </circle>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % chartData.xLabelStep !== 0 && i !== data.length - 1) return null;
          const x = chartData.xScale(i);
          const y = chartData.padding.top + chartData.chartHeight + 20;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              fill={axisColor}
              fontSize="11"
              transform={`rotate(-45, ${x}, ${y})`}
            >
              {d.periodLabel}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

