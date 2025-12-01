import { useMemo } from "react";
import type { AggregatedSlot } from "../types";

export function useChartScales({
  data,
  width,
  height,
  padding,
}: {
  data: AggregatedSlot[];
  width: number;
  height: number;
  padding: number;
}) {
  return useMemo(() => {
    if (!data.length) {
      return {
        maxValue: 0,
        getX: () => 0,
        getY: () => 0,
        yValues: [],
      };
    }

    const maxValue = Math.max(...data.map((d) => d.revenue));

    function computeYAxisStep(max: number, intervals: number) {
      const raw = max / intervals;
      const pow10 = Math.pow(10, Math.floor(Math.log10(raw)));
      const base = raw / pow10;

      let yAxisBase;
      if (base <= 1) yAxisBase = 1;
      else if (base <= 2) yAxisBase = 2;
      else if (base <= 5) yAxisBase = 5;
      else yAxisBase = 10;

      return yAxisBase * pow10;
    }

    const numIntervals = 5;
    const step = computeYAxisStep(maxValue, numIntervals);
    const yAxisMax = Math.ceil(maxValue / step) * step;

    //  y interval values
    const yValues: number[] = [];
    for (let v = 0; v <= yAxisMax; v += step) {
      yValues.push(v);
    }

    // scale funcrion

    const horizontalMargin = 20;
    const getX = (i: number) =>
      Math.round(
        padding +
          horizontalMargin +
          (i / (data.length - 1)) * (width - padding * 2 - horizontalMargin * 2)
      );

    const getY = (value: number) =>
      Math.round(
        height - padding - (value / yAxisMax) * (height - padding * 2)
      );

    return { maxValue, yValues, getX, getY };
  }, [data, width, height, padding]);
}
