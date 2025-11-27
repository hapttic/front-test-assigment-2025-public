import { AggregatedData } from "@/lib/interfaces/types";
import React, { useMemo, useState } from "react";

type Props = {
  data: AggregatedData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  yTicks?: number;
};

const TimelineChart = ({
  data,
  width = 1400,
  height = 290,
  margin = { top: 18, right: 436, bottom: 36, left: 80 },
  yTicks = 4,
}: Props) => {
  const parsed = useMemo(() => {
    return data
      .map((r) => {
        const date = parsePeriod(r.period);
        return { ...r, date, x: date.getTime(), y: Number(r.totalRevenue) };
      })
      .filter((r) => !Number.isNaN(r.x))
      .sort((a, b) => a.x - b.x);
  }, [data]);

  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xMin = parsed[0].x;
  const xMax = parsed[parsed.length - 1].x;
  const yMaxRaw = Math.max(...parsed.map((d) => d.y));
  const yMax = yMaxRaw === 0 ? 1 : yMaxRaw * 1.08;
  const yMin = 0;

  const xScale = (t: number) =>
    margin.left + ((t - xMin) / (xMax - xMin || 1)) * innerW;
  const yScale = (v: number) =>
    margin.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;


  const pathD = useMemo(() => {
    return parsed
      .map((p, i) => {
        const x = xScale(p.x);
        const y = yScale(p.y);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [parsed, xScale, yScale]);


  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Number((yMin + ((yMax - yMin) * i) / yTicks).toFixed(2))
  ).reverse();

  const maxXTicks = 6;
  const xTickIndexes = (() => {
    const n = parsed.length;
    if (n <= maxXTicks) return parsed.map((_, i) => i);
    const step = Math.max(1, Math.floor((n - 1) / (maxXTicks - 1)));
    const idxs = [];
    for (let i = 0; i < n; i += step) idxs.push(i);
    if (idxs[idxs.length - 1] !== n - 1) idxs.push(n - 1);
    return idxs;
  })();

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const xLabel = (date: Date) => {
    const firstDay = parsed[0].date.toISOString().slice(0, 10);
    const lastDay = parsed[parsed.length - 1].date.toISOString().slice(0, 10);
    if (firstDay === lastDay) {
      return date.getHours().toString().padStart(2, "0") + ":00";
    }
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:00`;
  };

  const findNearestIndexByClientX = (clientX: number, svgRect: DOMRect) => {
    const svgX = clientX - svgRect.left;
    const t = xMin + ((svgX - margin.left) / innerW) * (xMax - xMin || 1);
    let best = 0;
    let bestDiff = Math.abs(parsed[0].x - t);
    for (let i = 1; i < parsed.length; i++) {
      const diff = Math.abs(parsed[i].x - t);
      if (diff < bestDiff) {
        best = i;
        bestDiff = diff;
      }
    }
    return best;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Revenue over time line chart"
    >
      {parsed.length === 0 && <div>no data found</div>}
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopOpacity="0.95" stopColor="#179eb0" />
          <stop offset="100%" stopOpacity="0.15" stopColor="#2acbe0" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopOpacity="0.7" stopColor="#cffc53" />
          <stop offset="100%" stopOpacity="0.02" stopColor="#3eed2f" />
        </linearGradient>
      </defs>

      {/* background */}
      <rect x="0" y="0" width={1020} height={height} fill="white" />

      <g>
        {yTickValues.map((val, i) => {
          const y = yScale(val);
          return (
            <g key={i}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
                stroke="#e6eef6"
                strokeWidth={1}
              />
              <text
                x={margin.left - 8}
                y={y + 4}
                fontSize={11}
                textAnchor="end"
                fill="#222"
              >
                {val.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </text>
            </g>
          );
        })}
      </g>

      <g>
        {xTickIndexes.map((idx, i) => {
          const p = parsed[idx];
          const x = xScale(p.x);
          const yAxisTop = margin.top + innerH;
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={yAxisTop}
                y2={yAxisTop + 6}
                stroke="#999"
              />
              <text
                x={x}
                y={yAxisTop + 20}
                fontSize={11}
                textAnchor="middle"
                fill="#333"
              >
                {xLabel(p.date)}
              </text>
            </g>
          );
        })}
      </g>

      {/* colored area under line */}
      <path
        d={
          pathD +
          ` L ${xScale(parsed[parsed.length - 1].x).toFixed(2)} ${yScale(
            0
          ).toFixed(2)} L ${xScale(parsed[0].x).toFixed(2)} ${yScale(0).toFixed(
            2
          )} Z`
        }
        fill="url(#areaGradient)"
        stroke="none"
      />

      {/* line according revenue*/}
      <path
        d={pathD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* points */}
      <g>
        {parsed.map((p, i) => {
          const x = xScale(p.x);
          const y = yScale(p.y);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === hoverIndex ? 4.5 : 3}
              fill={i === hoverIndex ? "#0369a1" : "#0ea5ff"}
              stroke="#fff"
              strokeWidth={1}
            />
          );
        })}
      </g>

      {/* for mouse hover */}
      <rect
        x={margin.left}
        y={margin.top}
        width={innerW}
        height={innerH}
        fill="transparent"
        onMouseMove={(e) => {
          const r = (
            e.target as SVGRectElement
          ).ownerSVGElement!.getBoundingClientRect();
          const idx = findNearestIndexByClientX(e.clientX, r);
          setHoverIndex(idx);
        }}
        onMouseLeave={() => setHoverIndex(null)}
      />

      {/* tooltip popup */}
      {hoverIndex !== null &&
        (() => {
          const p = parsed[hoverIndex];
          const x = xScale(p.x);
          const y = yScale(p.y);
          const tooltipWidth = 120;
          const tooltipHeight = 44;
          const tx =
            x + tooltipWidth + 12 > width ? x - tooltipWidth - 12 : x + 8;
          const ty = y - tooltipHeight - 6 < 0 ? y + 8 : y - tooltipHeight - 6;
          return (
            <g>
              <line
                x1={x}
                x2={x}
                y1={margin.top}
                y2={margin.top + innerH}
                stroke="#c6e5ff"
                strokeDasharray="3 3"
              />
              <g transform={`translate(${tx}, ${ty})`}>
                <rect
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx={6}
                  ry={6}
                  fill="#fff"
                  stroke="#dbeafe"
                  strokeWidth={1}
                  filter=""
                  opacity={0.98}
                />
                <text
                  x={8}
                  y={16}
                  fontSize={12}
                  fill="#0f172a"
                  fontWeight={600}
                >
                  Revenue
                </text>
                <text x={8} y={32} fontSize={13} fill="#0f172a">
                  {p.totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </text>
                <text
                  x={tooltipWidth - 8}
                  y={16}
                  fontSize={11}
                  fill="#334155"
                  textAnchor="end"
                >
                  {xLabel(p.date)}
                </text>
              </g>
            </g>
          );
        })()}
    </svg>
  );
}
export default TimelineChart

const parsePeriod = (period: string) => {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}$/.test(period)) {
    const [d, h] = period.split("T");
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day, Number(h));
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const [y, m, day] = period.split("-").map(Number);
    return new Date(y, m - 1, day);
  }

  if (/^\d{4}-W\d{2}$/.test(period)) {
    const [y, weekStr] = period.split("-W");
    const year = Number(y);
    const week = Number(weekStr);

    const firstThursday = new Date(year, 0, 1);
    while (firstThursday.getDay() !== 4) {
      firstThursday.setDate(firstThursday.getDate() + 1);
    }
    return new Date(
      year,
      0,
      firstThursday.getDate() + (week - 1) * 7 - 3
    );
  }

  if (/^\d{4}-\d{2}$/.test(period)) {
    const [y, m] = period.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }

  return new Date(NaN);
}
