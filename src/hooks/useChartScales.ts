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
    const axisMax = Math.ceil(maxValue / step) * step;

    //  y interval values
    const yValues: number[] = [];
    for (let v = 0; v <= axisMax; v += step) {
      yValues.push(v);
    }

    // scale funcrion
    const getX = (i: number) =>
      padding + (i / (data.length - 1)) * (width - padding * 2);

    const getY = (value: number) =>
      height - padding - (value / axisMax) * (height - padding * 2);

    return { maxValue, yValues, getX, getY };
  }, [data, width, height, padding]);
}

// const maxValue = Math.max(...data.map((d) => d.revenue));
// console.log("max rev: ", maxValue);
// const width = 1300;
// const height = 400;
// const padding = 70;

// function niceStep(maxValue: number, numIntervals: number) {
//   const rawStep = maxValue / numIntervals;
//   const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep))); // 10^n
//   const base = rawStep / pow10;

//   let niceBase;
//   if (base <= 1) niceBase = 1;
//   else if (base <= 2) niceBase = 2;
//   else if (base <= 5) niceBase = 5;
//   else niceBase = 10;

//   return niceBase * pow10;
// }

// const numIntervals = 5;
// const step = niceStep(maxValue, numIntervals);
// const axisMax = Math.ceil(maxValue / step) * step;
// const yValues = [];
// for (let v = 0; v <= axisMax; v += step) {
//   yValues.push(v);
// }
// // for (let v = 0; v <= maxValue; v += step) {
// //   yValues.push(v);
// // }
// // if (yValues[yValues.length - 1] < maxValue) {
// //   yValues.push(step * yValues.length); // ensure last value >= maxValue
// // }

// const getX = (i: number) =>
//   padding + (i / (data.length - 1)) * (width - padding * 2);

// const getY = (value: number) =>
//   height - padding - (value / axisMax) * (height - padding * 2);

// //const numIntervals = 5;
// const intervalStep = Math.ceil(maxValue / numIntervals);
