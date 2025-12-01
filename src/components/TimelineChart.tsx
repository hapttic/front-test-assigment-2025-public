import { calculateScales } from "../utils";
import { useContainerDimensions } from "../hooks";
import type { AggregatedData, AggregationLevel, MetricType } from "../types";

interface IProps {
  data: AggregatedData[];
  metric: MetricType;
  aggregation: AggregationLevel;
  width?: number;
  height?: number;
}

const TimelineChart = ({ data, metric, aggregation, height = 400 }: IProps) => {
  const { ref, dimensions } = useContainerDimensions();
  const { width: containerWidth } = dimensions;

  const margin = { top: 20, right: 60, bottom: 40, left: 60 };
  const { xScale, yScale, xAxisPoints, yAxisPoints } = calculateScales(
    data,
    metric,
    containerWidth,
    height,
    margin
  );

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 bg-white rounded-lg border border-gray-200">
        No data available for chart
      </div>
    );
  }

  const linePath = data
    .map((point, index) => {
      const x = xScale(point.periodStart);
      const y = yScale(metric === "clicks" ? point.totalClicks : point.totalRevenue);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const dataPoints = data.map((point) => {
    const x = xScale(point.periodStart);
    const y = yScale(metric === "clicks" ? point.totalClicks : point.totalRevenue);
    const value = metric === "clicks" ? point.totalClicks : point.totalRevenue;

    return {
      x,
      y,
      value,
      period: point.period,
    };
  });

  return (
    <div
      ref={ref}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm w-full"
      style={{ minHeight: `${height}px` }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {metric === "clicks" ? "Total Clicks" : "Total Revenue"} Over Time
      </h3>

      <svg width={containerWidth} height={height} className="overflow-visible">
        {yAxisPoints.map((value, index) => {
          const y = yScale(value);
          return (
            <line
              key={`grid-y-${index}`}
              x1={margin.left}
              y1={y}
              x2={containerWidth - margin.right}
              y2={y}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
          );
        })}

        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {yAxisPoints.map((value, index) => {
          const y = yScale(value);
          return (
            <g key={`y-label-${index}`}>
              <line
                x1={margin.left - 5}
                y1={y}
                x2={margin.left}
                y2={y}
                stroke="#6b7280"
                strokeWidth={1}
              />
              <text
                x={margin.left - 10}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {metric === "revenue" ? "$" : ""}
                {value.toLocaleString()}
              </text>
            </g>
          );
        })}

        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={containerWidth - margin.right}
          y2={height - margin.bottom}
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {xAxisPoints.map((date, index) => {
          const x = xScale(date);
          return (
            <g key={`x-label-${index}`}>
              <line
                x1={x}
                y1={height - margin.bottom}
                x2={x}
                y2={height - margin.bottom + 5}
                stroke="#6b7280"
                strokeWidth={1}
              />
              <text
                x={x}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {formatXAxisLabel(date, aggregation)}
              </text>
            </g>
          );
        })}

        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          className="transition-all duration-300"
        />

        {dataPoints.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={4}
              fill="#3b82f6"
              className="transition-all duration-300 hover:r-6 cursor-pointer"
            />
            <title>
              {point.period}: {point.value.toLocaleString()} {metric === "clicks" ? "clicks" : "revenue"}
            </title>
          </g>
        ))}
      </svg>
    </div>
  );
};

const formatXAxisLabel = (date: Date, aggregation: string): string => {
  switch (aggregation) {
    case "hourly":
      return date.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false });
    case "daily":
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    case "weekly":
      return `W${Math.ceil(date.getDate() / 7)}`;
    case "monthly":
      return date.toLocaleDateString("en-US", { month: "short" });
    default:
      return date.toLocaleDateString();
  }
};

export default TimelineChart;
