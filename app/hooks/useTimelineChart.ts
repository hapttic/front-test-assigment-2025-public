import { useMemo } from "react";
import { AggregatedRow } from "@/app/lib/types";

interface UseTimelineChartProps {
  data: AggregatedRow[];
  metric: "clicks" | "revenue";
  mode: "hourly" | "daily" | "weekly" | "monthly";
}

export function useTimelineChart({
  data,
  metric,
  mode,
}: UseTimelineChartProps) {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const simplify = (arr: AggregatedRow[]) => {
      let limit = 200;

      if (mode === "hourly") limit = 200;
      if (mode === "daily") limit = 200;
      if (mode === "weekly") limit = 200;
      if (mode === "monthly") limit = 100;

      if (arr.length <= limit) return arr;

      const step = Math.ceil(arr.length / limit);
      return arr.filter((_, i) => i % step === 0);
    };

    const simplified = simplify(data);

    const values = simplified.map((d) => d[metric]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue || 1;

    const width = 1200;
    const height = 300;
    const padding = { top: 20, right: 2, bottom: 80, left: 62 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xScale = (index: number) =>
      (index / (simplified.length - 1 || 1)) * chartWidth;

    const yScale = (value: number) =>
      chartHeight - ((value - minValue) / valueRange) * chartHeight;

    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
      const value = minValue + (valueRange * i) / (tickCount - 1);
      return { value, y: yScale(value) };
    });

    const pathData = simplified
      .map((d, i) => {
        const x = xScale(i);
        const y = yScale(d[metric]);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");

    const areaPath = `${pathData} L ${xScale(
      simplified.length - 1
    )} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;

    return {
      simplified,
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      xScale,
      yScale,
      yTicks,
      pathData,
      areaPath,
      gradientId: `gradient-${metric}`,
    };
  }, [data, metric, mode]);
}
