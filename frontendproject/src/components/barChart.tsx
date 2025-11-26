import type { AggregatedBucket } from "../types/data";

type BarChartProps = {
  data: AggregatedBucket[];
  width?: number;
  height?: number;
};

export default function BarChart({
  data,
  // default value w,h of 720 , 280
  width = 720,
  height = 280,
}: BarChartProps) {
  const margin = { top: 12, right: 12, bottom: 40, left: 40 }; // default margins
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxClicks = Math.max(...data.map((bucket) => bucket.totalClicks)); // return highest click number
  const barWidth = chartWidth / data.length; // calc width

  const getBarTop = (value: number) =>
    chartHeight - (value / maxClicks) * chartHeight;

  return (
    <svg width={width} height={height} role="img" aria-label="Clicks bar chart">
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {data.map((bucket, index) => {
          // map every rect text and label for each data row
          const x = index * barWidth + barWidth * 0.1;
          const top = getBarTop(bucket.totalClicks);
          const barHeight = chartHeight - top;
          return (
            <g key={bucket.key}>
              <rect
                x={x}
                y={top}
                width={barWidth * 0.8}
                height={barHeight}
                fill="#38bdf8"
              />
              <text
                x={x + barWidth * 0.4}
                y={top - 4}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize={11}
              >
                {bucket.totalClicks}
              </text>
              <text
                x={x + barWidth * 0.4}
                y={chartHeight + 14}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={10}
              >
                {bucket.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
