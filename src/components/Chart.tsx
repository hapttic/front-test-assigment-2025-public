import { useEffect, useRef, useState } from "react";
import { useChartScales } from "../hooks/useChartScales";
import type { AggregatedSlot } from "../types";
import { useContainerWidth } from "../hooks/useContainerWidth";

export default function Chart({
  data,
  aggregation,
}: {
  data: AggregatedSlot[];
  aggregation: "hourly" | "daily" | "weekly" | "monthly";
}) {
  const [ready, setReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef) || 800;

  const padding = 90;
  const pointSpacing = 20;

  const baseWidth = padding * 2 + data.length * pointSpacing;

  const width = Math.max(containerWidth, baseWidth);

  const height = 500;

  const { maxValue, yValues, getX, getY } = useChartScales({
    data,
    width,
    height,
    padding,
  });

  console.log("max rev: ", maxValue);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || !data.length) return null;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.revenue)}`)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className="w-full p-4 overflow-x-auto shadow-md rounded my-wrapper"
    >
      <svg width={width} height={height} className="bg-white rounded  ">
        {/* x axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#999"
        />

        <text
          x={width - padding / 4}
          y={height - padding}
          fontSize={12}
          textAnchor="end"
        >
          {aggregation}
        </text>

        {/* y axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#999"
        />

        <text
          x={padding}
          y={padding - 10}
          fontSize={12}
          textAnchor="start"
          transform={`rotate(-90, ${padding}, ${padding - 10})`}
        >
          Revenue
        </text>

        {/* y Labels (revenue) with lines */}
        {yValues.map((value, i) => (
          <g key={i}>
            <line
              x1={padding}
              y1={getY(value)}
              x2={width - padding}
              y2={getY(value)}
              stroke="#eee"
            />
            <text
              x={padding - 10}
              y={getY(value)}
              fontSize={10}
              textAnchor="end"
            >
              {value}
            </text>
          </g>
        ))}

        {/* graphic line */}
        <path d={linePath} fill="none" stroke="blue" strokeWidth={2} />

        {/* points */}
        {data.map((d, i) => (
          <circle key={i} cx={getX(i)} cy={getY(d.revenue)} r="4" fill="blue" />
        ))}

        {/* X Labels (time) */}
        {data.map((d, i) => (
          <text
            key={`label-${i}`}
            x={getX(i)}
            y={height - 40}
            fontSize={10}
            textAnchor="middle"
            transform={`rotate(-90, ${getX(i)}, ${height - 40})`}
          >
            {d.start}
          </text>
        ))}
      </svg>
    </div>
  );
}
