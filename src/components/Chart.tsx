import { useChartScales } from "../hooks/useChartScales";
import type { AggregatedSlot } from "../types";

// export default function Chart({ data }: { data: AggregatedSlot[] }) {
//   if (!data.length) return null;

//   const maxRevenue = Math.max(...data.map((d) => d.revenue));

//   return (
//     <svg className="w-full h-48 border rounded bg-white">
//       {data.map((d, i) => {
//         const x = (i / (data.length - 1)) * 100;
//         const y = 100 - (d.revenue / maxRevenue) * 100;

//         return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" fill="blue" />;
//       })}
//     </svg>
//   );
// }

export default function Chart({
  data,
  aggregation,
}: {
  data: AggregatedSlot[];
  aggregation: "hourly" | "daily" | "weekly" | "monthly";
}) {
  if (!data.length) return null;

  const width = 1300;
  const height = 400;
  const padding = 40;

  const { maxValue, yValues, getX, getY } = useChartScales({
    data,
    width,
    height,
    padding,
  });

  console.log("max rev: ", maxValue);
  //const intervalStep = Math.ceil(maxValue / numIntervals);

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.revenue)}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="bg-white border rounded">
      {/* X Axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#999"
      />
      {/* <text x={width / 2} y={height - 5} fontSize={12} textAnchor="middle">
        Days
      </text> */}
      <text
        x={width - padding + 35}
        y={height - padding - 10}
        fontSize={12}
        textAnchor="end"
      >
        {aggregation}
      </text>

      {/* Y Axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#999"
      />
      {/* <text
        x={15} // left margin
        y={height / 2} // centered vertically
        fontSize={12}
        textAnchor="middle"
        transform={`rotate(-90, 15, ${height / 2})`}
      >
        Revenue
      </text> */}
      <text
        x={padding}
        y={padding - 10}
        fontSize={12}
        textAnchor="start"
        transform={`rotate(-90, ${padding}, ${padding - 10})`}
      >
        Revenue
      </text>

      {/* {Array.from({ length: numIntervals + 1 }).map((_, i) => {
        const value = i * intervalStep;
        const y = getY(value);

        return (
          <g key={i}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#eee"
            />
            <text x={padding - 10} y={y} fontSize={10} textAnchor="end">
              {value}
            </text>
          </g>
        );
      })} */}
      {yValues.map((value, i) => (
        <g key={i}>
          <line
            x1={padding}
            y1={getY(value)}
            x2={width - padding}
            y2={getY(value)}
            stroke="#eee"
          />
          <text x={padding - 10} y={getY(value)} fontSize={10} textAnchor="end">
            {value}
          </text>
        </g>
      ))}

      {/* Line */}
      <path d={linePath} fill="none" stroke="blue" strokeWidth={2} />

      {/* Points */}
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.revenue)} r="4" fill="blue" />
      ))}

      {/* X Labels (time) */}
      {data.map((d, i) => (
        <text
          key={`label-${i}`}
          x={getX(i)}
          y={height - 35}
          fontSize={10}
          textAnchor="middle"
          transform={`rotate(-90, ${getX(i)}, ${height - 35})`}
        >
          {d.start.toLocaleDateString()}
          {/* {d.timeLabel} */}
        </text>
      ))}
      {/* {Array.from({ length: numIntervals + 1 }).map((_, i) => {
        const value = i * intervalStep;
        const y = getY(value);

        return (
          <text
            key={i}
            x={padding - 10} // left of axis
            y={y}
            fontSize={10}
            textAnchor="end"
          >
            {value}
          </text>
        );
      })} */}

      {/* Y max label */}
      {/* <text x={padding - 10} y={padding} fontSize={10} textAnchor="end">
        {maxValue}
      </text> */}
    </svg>
  );
}
