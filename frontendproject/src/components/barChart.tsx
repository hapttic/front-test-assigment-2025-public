import type { AggregatedBucket } from "../types/data";

type BarChartProps = {
  data: AggregatedBucket[];
  width?: number;
  height?: number;
};

export default function BarChart({
  data,
  width = 720,
  height = 280,
}: BarChartProps) {
  const margin = { top: 12, right: 12, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right; // calc full w
  const chartHeight = height - margin.top - margin.bottom; // calc full h
  const maxClicks = Math.max(...data.map((bucket) => bucket.totalClicks)); // biggest click number

  const minBarWidth = 8;
  const maxBarWidth = 50;
  const gap = data.length <= 20 ? 40 : 12; // to update gap within bars
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
    chartHeight - (value / maxClicks) * chartHeight;

  // labels
  const showLabelEvery =
    data.length <= 12 ? 1 : Math.max(1, Math.floor(data.length / 15));
  const showValueLabel = barWidth > 15;

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <svg
        width={svgWidth}
        height={height}
        role="img"
        aria-label="Clicks bar chart"
      >
        <g transform={`translate(${margin.left + startX}, ${margin.top})`}>
          {data.map((bucket, index) => {
            const x = index * totalBarWidth;
            const top = getBarTop(bucket.totalClicks);
            const barHeight = chartHeight - top;
            const showLabel =
              index % showLabelEvery === 0 || index === data.length - 1;

            return (
              <g key={bucket.key}>
                <line
                  x1={x + barWidth / 2}
                  y1={0}
                  x2={x + barWidth / 2}
                  y2={chartHeight}
                  stroke="#334155"
                  strokeWidth={0.5}
                  opacity={0.3}
                />
                <rect
                  x={x}
                  y={top}
                  width={barWidth}
                  height={barHeight}
                  fill="#38bdf8"
                />
                {showValueLabel && (
                  <text
                    x={x + barWidth / 2}
                    y={top - 4}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize={11}
                  >
                    {bucket.totalClicks}
                  </text>
                )}
                {showLabel && (
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 14}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize={10}
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
