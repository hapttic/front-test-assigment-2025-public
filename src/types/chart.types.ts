export type MetricType = "clicks" | "revenue";

export interface ChartScales {
  xScale: (value: Date) => number;
  yScale: (value: number) => number;
  xAxisPoints: Date[];
  yAxisPoints: number[];
}
