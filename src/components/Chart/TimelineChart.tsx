import React, { useMemo } from "react";
import "./TimelineChart.scss";
import type { AggregatedDataPoint } from "../../utils/dataProcessor";

type MetricType = "Clicks" | "Revenue";

interface TimelineChartProps {
  data: AggregatedDataPoint[];
  selectedMetric: MetricType;
  onSelectMetric: (type: MetricType) => void;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  selectedMetric,
  onSelectMetric,
}) => {
  const options: MetricType[] = ["Clicks", "Revenue"];

  const { points, maxValue, xLabels } = useMemo(() => {
    if (!data.length) return { points: "", maxValue: 0, xLabels: [] };

    const values = data.map((d) =>
      selectedMetric === "Clicks" ? d.clicks : d.revenue
    );
    const maxVal = Math.max(...values, 1);
    const minTime = data[0].timestamp;
    const maxTime = data[data.length - 1].timestamp;
    const timeRange = maxTime - minTime || 1;

    const width = 800;
    const height = 300;
    const padding = { top: 50, bottom: 50, left: 60, right: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const coordinates = data.map((d) => {
      const val = selectedMetric === "Clicks" ? d.clicks : d.revenue;
      const x =
        data.length === 1
          ? padding.left + chartWidth / 2
          : padding.left + ((d.timestamp - minTime) / timeRange) * chartWidth;
      const y = padding.top + chartHeight - (val / maxVal) * chartHeight;
      return { x, y, label: d.label };
    });

    const pointsStr = coordinates.map((p) => `${p.x},${p.y}`).join(" ");

    const labelStep = Math.ceil(coordinates.length / 6);
    const labels = coordinates.filter(
      (_, i) => i % labelStep === 0 || i === coordinates.length - 1
    );

    return { points: pointsStr, maxValue: maxVal, xLabels: labels };
  }, [data, selectedMetric]);

  return (
    <div className="timeline-chart-container">
      <div className="chart-header">
        <h3>Performance Timeline</h3>
        <div className="button-group">
          {options.map((option) => (
            <button
              key={option}
              className={`control-btn ${
                selectedMetric === option ? "active" : ""
              }`}
              onClick={() => onSelectMetric(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrapper">
        <svg className="chart-svg" viewBox="0 0 800 300">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = 250 - tick * 200;
            return (
              <g key={tick}>
                <line
                  x1="60"
                  y1={y}
                  x2="750"
                  y2={y}
                  stroke="#2a2e35"
                  strokeWidth="1"
                />
                <text
                  x="50"
                  y={y + 4}
                  textAnchor="end"
                  fill="#6b7280"
                  fontSize="12"
                >
                  {selectedMetric === "Revenue" ? "$" : ""}
                  {Math.round(maxValue * tick).toLocaleString()}
                </text>
              </g>
            );
          })}

          {points && (
            <polyline
              points={points}
              fill="none"
              stroke={selectedMetric === "Clicks" ? "#00d2ff" : "#ff9f43"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {xLabels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y="275"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              {label.label}
            </text>
          ))}

          {!data.length && (
            <text x="400" y="150" textAnchor="middle" fill="#6b7280">
              No Data Available
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default TimelineChart;
