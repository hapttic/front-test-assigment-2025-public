import type { TimelineChartProps } from "../types/types";

function TimelineChart({ title, data }: TimelineChartProps) {
  const chartWidth = 800;
  const chartHeight = 400;

  const distanceBetweenPoints = chartWidth / (data.length - 1);

  const maxValue = Math.max(...data.map((point) => point.value)) + 2;
  const minValue = Math.min(...data.map((point) => point.value)) - 2;
  const valueRange = maxValue - minValue;

  const getY = (value: number) => {
    if (valueRange === 0) return chartHeight / 2;
    return chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  return (
    <div className="w-full bg-red-200 flex justify-center items-center">
      <svg className="bg-yellow-200" width={chartWidth} height={chartHeight}>
        {data.map((point, index) => {
          return (
            <circle
              key={index}
              cx={index * distanceBetweenPoints}
              cy={getY(point.value)}
              r={5}
              fill="blue"
            />
          );
        })}

        {data.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = data[index - 1];
          return (
            <line
              key={index}
              x1={(index - 1) * distanceBetweenPoints}
              y1={getY(prevPoint.value)}
              x2={index * distanceBetweenPoints}
              y2={getY(point.value)}
              stroke="blue"
              strokeWidth={2}
            />
          );
        })}

        {data.map((point, index) => {
          return (
            <text
              key={index}
              x={index * distanceBetweenPoints}
              y={chartHeight}
              fontSize="12"
              fill="black"
            >
              {point.timestamp}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default TimelineChart;
