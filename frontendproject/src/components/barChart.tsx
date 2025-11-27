import type { AggregatedBucket } from "../types/data";

type BarChartProps = {
  data: AggregatedBucket[];
  metric: "clicks" | "revenue";
  width?: number;
  height?: number;
};

export default function BarChart({
  data,
  metric,
  width = 720,
  height = 280,
}: BarChartProps) {
  // Increase bottom margin for better label spacing, especially for weekly
  const margin = { top: 12, right: 12, bottom: 50, left: 40 };
  const chartWidth = width - margin.left - margin.right; // calc full w
  const chartHeight = height - margin.top - margin.bottom; // calc full h
  const values = data.map((bucket) =>
    metric === "clicks" ? bucket.totalClicks : bucket.totalRevenue
  );
  const maxValue = values.length > 0 ? Math.max(...values) : 1; // biggest value

  const minBarWidth = 8;
  const maxBarWidth = 50;
  // Adjust gap based on data length - more space for fewer items
  const gap = data.length <= 15 ? 40 : data.length <= 30 ? 20 : 8;
  const calculatedBarWidth =
    (chartWidth - (data.length - 1) * gap) / data.length;
  const barWidth = Math.max(
    minBarWidth,
    Math.min(maxBarWidth, calculatedBarWidth)
  );
  const totalBarWidth = barWidth + gap;
  const totalWidth = data.length * totalBarWidth;
  const startX = data.length <= 20 ? (chartWidth - totalWidth) / 2 : 0;
  const svgWidth =
    data.length <= 20
      ? width
      : Math.max(width, totalWidth + margin.left + margin.right);

  // detect when it reaches roof so it doesnt go over
  const getBarTop = (value: number) =>
    chartHeight - (value / maxValue) * chartHeight;

  const formatValue = (value: number) => {
    if (metric === "revenue") {
      return `$${value.toFixed(0)}`;
    }
    return value.toLocaleString();
  };

  const showLabelEvery =
    data.length <= 10
      ? 1
      : data.length <= 20
      ? 2
      : Math.max(1, Math.floor(data.length / 12));
  const showValueLabel = barWidth > 15;

  const barColor = metric === "clicks" ? "#06b6d4" : "#10b981"; // cyan for clicks, green for revenue
  const barColorHover = metric === "clicks" ? "#0891b2" : "#059669";

  return (
    <div
      style={{ overflowX: "auto", width: "100%" }}
      className="custom-scrollbar"
    >
      <svg
        width={svgWidth}
        height={height}
        role="img"
        aria-label={`${metric} bar chart`}
        className="chart-svg"
      >
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={barColor} stopOpacity="1" />
            <stop offset="100%" stopColor={barColorHover} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g transform={`translate(${margin.left + startX}, ${margin.top})`}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="#334155"
              strokeWidth={0.5}
              opacity={0.2}
              strokeDasharray="2,2"
            />
          ))}
          {data.map((bucket, index) => {
            const x = index * totalBarWidth;
            const value =
              metric === "clicks" ? bucket.totalClicks : bucket.totalRevenue;
            const top = getBarTop(value);
            const barHeight = chartHeight - top;
            const showLabel =
              index % showLabelEvery === 0 || index === data.length - 1;

            return (
              <g key={bucket.key} className="bar-group">
                <rect
                  x={x}
                  y={top}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx={4}
                />
                {showValueLabel && (
                  <text
                    x={x + barWidth / 2}
                    y={top - 6}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize={11}
                    fontWeight="600"
                    className="drop-shadow-sm"
                  >
                    {formatValue(value)}
                  </text>
                )}
                {showLabel && (
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 22}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize={10}
                    fontWeight="500"
                    style={{ userSelect: "none" }}
                  >
                    {bucket.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
