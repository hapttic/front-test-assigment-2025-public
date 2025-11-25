import { useMemo } from "react";
import type { AggregatedRow } from "../types";

export default function LineChartSVG({
  rows,
  metric = "revenue",
  height = 220,
}: {
  rows: AggregatedRow[];
  metric?: "revenue" | "clicks";
  height?: number;
}) {
  const width = 920;
  const padding = { top: 12, right: 24, bottom: 36, left: 52 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const points = useMemo(
    () => rows.map((r, i) => ({ i, value: r[metric] })),
    [rows, metric]
  );
  const yMax = Math.max(...points.map((p) => p.value), 1);
  const xN = Math.max(1, points.length - 1);

  const x = (i: number) => padding.left + (i / xN) * w;
  const y = (val: number) => padding.top + h - (val / yMax) * h;

  const path = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${x(idx)} ${y(p.value)}`)
    .join(" ");

  return (
    <div className="bg-white rounded p-3 shadow">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={padding.top + h * (1 - t)}
              y2={padding.top + h * (1 - t)}
              stroke="#e6e6e6"
            />
            <text x={12} y={padding.top + h * (1 - t) + 4} fontSize={10}>
              {Math.round(yMax * t)}
            </text>
          </g>
        ))}

        <path
          d={path}
          stroke="#0f172a"
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(
          (p, idx) =>
            idx % Math.ceil(points.length / 6 || 1) === 0 && (
              <text
                key={idx}
                x={x(idx)}
                y={height - 8}
                fontSize={10}
                textAnchor="middle"
              >
                {rows[idx].label}
              </text>
            )
        )}
      </svg>
    </div>
  );
}
