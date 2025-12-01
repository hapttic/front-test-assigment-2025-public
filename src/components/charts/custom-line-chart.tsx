import { useState } from "react";

export type Point = { label: string; value: number };

type CommonProps = {
  data: Point[];
  width?: number;
  height?: number;
  padding?: number;
  showAxes?: boolean;
};

// Custom line chart which is not user because it's not a good chart for this use case.
export const CustomLineChart = ({
  data,
  width = 600,
  height = 240,
  padding = 36,
  showAxes = true,
}: CommonProps) => {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    point?: Point;
  } | null>(null);

  const values = data.map((d) => d.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);

  const x = (i: number) => {
    const step = (width - padding * 2) / Math.max(1, data.length - 1);
    return padding + i * step;
  };
  const y = (val: number) => {
    const usable = height - padding * 2;
    return padding + ((max - val) / (max - min || 1)) * usable;
  };

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`)
    .join(" ");

  return (
    <div className="w-full max-w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {showAxes && (
          <g className="text-gray-400 stroke-current">
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              strokeWidth={1}
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={height - padding}
              strokeWidth={1}
            />

            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const val = min + t * (max - min);
              const yy = y(val);
              return (
                <g key={t}>
                  <line
                    x1={padding - 6}
                    x2={padding}
                    y1={yy}
                    y2={yy}
                    strokeWidth={1}
                  />
                  <text
                    x={padding - 10}
                    y={yy + 4}
                    textAnchor="end"
                    fontSize={10}
                  >
                    {Number(val.toFixed(2))}
                  </text>
                </g>
              );
            })}

            {data.map((d, i) => (
              <g key={d.label}>
                <line
                  x1={x(i)}
                  x2={x(i)}
                  y1={height - padding}
                  y2={height - padding + 6}
                  strokeWidth={1}
                />
                <text
                  x={x(i)}
                  y={height - padding + 18}
                  fontSize={10}
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            ))}

            <text
              x={width / 2}
              y={height - 4}
              textAnchor="middle"
              fontSize={12}
              className="fill-gray-500"
            >
              X Axis
            </text>
            <text
              x={-height / 2}
              y={14}
              transform="rotate(-90)"
              textAnchor="middle"
              fontSize={12}
              className="fill-gray-500"
            >
              Y Axis
            </text>
          </g>
        )}

        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const val = min + t * (max - min);
          const yy = y(val);
          return (
            <line
              key={t}
              x1={padding}
              x2={width - padding}
              y1={yy}
              y2={yy}
              stroke="rgba(0,0,0,0.06)"
            />
          );
        })}

        <path
          d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${
            height - padding
          } Z`}
          fill="rgba(99,102,241,0.06)"
        />

        <path
          d={pathD}
          fill="none"
          stroke="#6366F1"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <g
            key={d.label}
            onMouseEnter={() => setHover({ x: x(i), y: y(d.value), point: d })}
            onMouseLeave={() => setHover(null)}
          >
            <circle
              cx={x(i)}
              cy={y(d.value)}
              r={4}
              fill="#fff"
              stroke="#6366F1"
              strokeWidth={2}
            />
            <rect
              x={x(i) - 10}
              y={padding}
              width={20}
              height={height - padding * 2}
              fill="transparent"
            />
          </g>
        ))}

        {hover?.point && (
          <g pointerEvents="none">
            <rect
              x={hover.x + 8}
              y={hover.y - 28}
              rx={4}
              ry={4}
              width={90}
              height={22}
              fill="#111827"
              opacity={0.9}
            />
            <text x={hover.x + 12} y={hover.y - 12} fontSize={12} fill="#fff">
              {hover.point.label}: {hover.point.value}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
