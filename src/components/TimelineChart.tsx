import { MetricType, type AggregatedDataPoint, type TimelineChartProps } from "../types/types";

function TimelineChart({ title, data, metricType }: TimelineChartProps) {
  const chartWidth = 800;
  const chartHeight = 400;

  const graphPadding = 40;
  const yAxisLabelWidth = 30;

  const graphWidth = chartWidth - graphPadding * 2 - yAxisLabelWidth;
  const graphHeight = chartHeight - graphPadding * 2;

  const distanceBetweenPoints = graphWidth / (data.length - 1);

   const getValue = (point: AggregatedDataPoint) => {
    switch (metricType) {
      case MetricType.REVENUE:
        return point.revenue;
      case MetricType.CLICKS:
        return point.clicks;
      default:
        return 0;
    }
  }

  const maxValue = Math.max(...data.map((point) => getValue(point))) + 2;
  const minValue = Math.min(...data.map((point) => getValue(point))) - 2;
  const valueRange = maxValue - minValue;

  const getY = (value: number) => {
    if (valueRange === 0) return graphHeight / 2 + graphPadding;
    return (
      graphPadding +
      (graphHeight - ((value - minValue) / valueRange) * graphHeight)
    );
  };

  const getX = (index: number) => {
    return graphPadding + yAxisLabelWidth + index * distanceBetweenPoints;
  };

  const getYAxisLabels = () => {
    const labelCount = 5;
    const labelStep = valueRange / (labelCount - 1);

    const labels = [];
    for (let i = 0; i < labelCount; i++) {
      const label = minValue + i * labelStep;
      const y = getY(label);

      labels.push({ label, y });
    }
    return labels;
  };

  return (
    <div className="w-full bg-red-200 flex justify-center items-center">
      <svg className="bg-yellow-200" width={chartWidth} height={chartHeight}>
        {data.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = data[index - 1];
          return (
            <line
              key={index}
              x1={getX(index - 1)}
              y1={getY(getValue(prevPoint))}
              x2={getX(index)}
              y2={getY(getValue(point))}
              stroke="blue"
              strokeWidth={2}
            />
          );
        })}

        {data.map((point, index) => {
          return (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(getValue(point))}
              r={5}
              fill="blue"
            />
          );
        })}

        {getYAxisLabels().map((label, index) => (
          <text
            key={index}
            x={yAxisLabelWidth - 10}
            y={label.y}
            fontSize="10"
            fill="black"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {label.label}
          </text>
        ))}

        {data.map((point, index) => {
          const labelSkip = Math.ceil(data.length / 5);
          if (index % labelSkip !== 0 && index !== data.length - 1) return null;
          return (
            <text
              key={`label-${index}`}
              x={getX(index)}
              y={chartHeight - 10}
              fontSize="12"
              fill="black"
              textAnchor="middle"
              style={{ pointerEvents: "none" }}
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default TimelineChart;
