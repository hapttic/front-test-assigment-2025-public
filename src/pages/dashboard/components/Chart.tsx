import { memo, useMemo, useState } from "react";
import type {
  AggregatedData,
  AggregationPeriod,
  MetricEnum,
} from "../../../lib/types";
import {
  capitalizeFirstLetter,
  formatDate,
  formatNumber,
} from "../../../lib/utils";

interface props {
  data: AggregatedData[];
  metric: MetricEnum;
  period: AggregationPeriod;
}

function Chart({ data, metric, period }: props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chatData = useMemo(() => {
    const values = data.map((d) =>
      metric === "revenue" ? d.totalRevenue : d.totalClicks
    );
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values, 0);

    return {
      values: values,
      max: maxValue * 1.1,
      min: Math.max(0, minValue * 0.9),
    };
  }, [data, metric]);

  const range = chatData.max - chatData.min;

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = chatData.min + (range * (4 - i)) / 4;
    return Math.round(value);
  });

  return (
    <div className="w-full p-6 bg-background border border-border rounded-xl overflow-x-scroll">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        {capitalizeFirstLetter(metric)} Chart ({capitalizeFirstLetter(period)})
      </h3>

      <div className="flex gap-4">
        <div className="flex flex-col justify-between h-64 text-right pr-2">
          {yTicks.map((tick, i) => (
            <span key={i} className="text-xs text-muted-foreground">
              {tick}
            </span>
          ))}
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yTicks.map((_, i) => (
              <div key={i} className="w-full border-t border-border/50" />
            ))}
          </div>

          <div className="relative flex items-end gap-3 h-64">
            {chatData.values.map((value, index) => {
              const heightPercent = ((value - chatData.min) / range) * 100;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  onMouseEnter={() =>
                    period !== "hourly" && setHoveredIndex(index)
                  }
                  onMouseLeave={() =>
                    period !== "hourly" && setHoveredIndex(null)
                  }
                >
                  {isHovered && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-md shadow-lg z-10 whitespace-nowrap">
                      {metric === "revenue"
                        ? "$ " + formatNumber(value)
                        : value}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                    </div>
                  )}

                  <div
                    className="w-full rounded-t-md transition-all duration-300 ease-out cursor-pointer"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: !isHovered
                        ? "oklch(0.45 0.15 264)"
                        : "#10b981",
                      opacity: isHovered ? 1 : 0.8,
                      transform: isHovered ? "scaleX(1.05)" : "scaleX(1)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-3">
            {data.map((d, i) => {
              return (
                <div key={i} className="flex-1 text-center">
                  <span className="text-[12px] text-muted-foreground truncate block">
                    {formatDate(d.timestamp, period)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Chart);
