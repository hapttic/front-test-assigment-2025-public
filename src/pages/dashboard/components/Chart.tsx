import { memo, useMemo } from "react";
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
  const chatData = useMemo(() => {
    const arr = data.map((d) =>
      metric === "revenue"
        ? { value: d.totalRevenue, dateStr: formatDate(d.timestamp, period) }
        : { value: d.totalClicks, dateStr: formatDate(d.timestamp, period) }
    );

    const minValue = Math.min(...arr.map((v) => v.value));
    const maxValue = Math.max(...arr.map((v) => v.value));

    return {
      values: arr,
      max: maxValue * 1.1,
      min: Math.max(0, minValue * 0.9),
    };
  }, [data, metric, period]);

  console.log(chatData);

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

          <div className="relative flex items-end gap-3 pr-4 h-64">
            {chatData.values.map((item, index) => {
              const heightPercent = ((item.value - chatData.min) / range) * 100;

              return (
                <div
                  key={index}
                  className=" flex-1 flex flex-col items-center justify-end h-full relative group"
                >
                  {
                    <div className="absolute opacity-0  group-hover:opacity-100 transition-all duration-300 -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-chart-3 text-sm font-semibold text-center rounded-md shadow-lg z-10 whitespace-nowrap">
                      {metric === "revenue"
                        ? "$ " + formatNumber(item.value)
                        : item.value}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                      <p className="text-xs text-muted-foreground font-normal">
                        {item.dateStr}
                      </p>
                    </div>
                  }

                  <div
                    className="min-w-[100px] w-full bg-primary hover:bg-chart-3 hover:scale-x-105 rounded-t-md transition-all duration-300 ease-out cursor-pointer"
                    style={{
                      height: `${heightPercent}%`,
                    }}
                  />

                  <div className="absolute bottom-0 translate-y-[120%] ">
                    <p className="text-xs text-muted-foreground mr-auto line-clamp-1">
                      {item.dateStr}
                    </p>
                  </div>
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
