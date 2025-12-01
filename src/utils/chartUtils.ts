import type { AggregatedData, ChartScales, MetricType } from "../types";

export const calculateScales = (
  data: AggregatedData[],
  metric: MetricType,
  width: number,
  height: number,
  margin = { top: 20, right: 30, bottom: 40, left: 60 }
): ChartScales => {
  if (!data.length || width === 0) {
    return {
      xScale: () => 0,
      yScale: () => 0,
      xAxisPoints: [],
      yAxisPoints: [],
    };
  }

  const adjustedMargin = {
    ...margin,
    left: width < 500 ? 40 : margin.left,
    right: width < 500 ? 20 : margin.right,
  };

  const availableWidth = width - adjustedMargin.left - adjustedMargin.right;
  const availableHeight = height - adjustedMargin.top - adjustedMargin.bottom;

  const dates = data.map((d) => d.periodStart);
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const xScale = (date: Date) => {
    const range = maxDate.getTime() - minDate.getTime();
    const position = date.getTime() - minDate.getTime();
    return adjustedMargin.left + (position / range) * availableWidth;
  };

  const values = data.map((d) => d[metric === "clicks" ? "totalClicks" : "totalRevenue"]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const yPadding = maxValue * 0.1;
  const yMax = maxValue + yPadding;
  const yMin = Math.max(0, minValue - yPadding);

  const yScale = (value: number) => {
    return adjustedMargin.top + availableHeight - ((value - yMin) / (yMax - yMin)) * availableHeight;
  };

  const xAxisPoints = generateXAxisPoints(minDate, maxDate, Math.min(data.length, width < 500 ? 3 : 5));
  const yAxisPoints = generateYAxisPoints(yMin, yMax, width < 500 ? 3 : 5);

  return { xScale, yScale, xAxisPoints, yAxisPoints };
};

const generateXAxisPoints = (minDate: Date, maxDate: Date, steps: number): Date[] => {
  const points: Date[] = [];

  for (let i = 0; i < steps; i++) {
    const time = minDate.getTime() + ((maxDate.getTime() - minDate.getTime()) * i) / (steps - 1);
    points.push(new Date(time));
  }

  return points;
};

const generateYAxisPoints = (minValue: number, maxValue: number, steps: number): number[] => {
  const points: number[] = [];

  for (let i = 0; i < steps; i++) {
    const value = minValue + ((maxValue - minValue) * i) / (steps - 1);
    points.push(Math.round(value));
  }

  return points;
};
