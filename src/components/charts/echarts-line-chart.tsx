import * as echarts from "echarts";
import { useEffect, useMemo, useRef } from "react";

const colorsMap = {
  c1: "#6366F1",
  c2: "#8B5CF6",
  c3: "#EC4899",
  c4: "#F59E0B",
  c5: "#10B981",
};

type EChartsLineChartProps = {
  data: { x: number | string | Date; y: number; name?: string }[];
  title: string;
  width?: string | number;
  height?: string | number;
};

// I used echarts because it's a canvas based chart library and it's much optimized for performance.
export const EChartsLineChart = ({
  data,
  title,
  width = "100%",
  height = 400,
}: EChartsLineChartProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
    });
    instanceRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [data]);

  const seriesData = useMemo(() => {
    const grouped = new Map<string, Array<[number | string, number]>>();

    data.forEach((d) => {
      const seriesName = d.name || "Value";
      const xValue = d.x instanceof Date ? d.x.getTime() : d.x;

      if (!grouped.has(seriesName)) {
        grouped.set(seriesName, []);
      }
      grouped.get(seriesName)!.push([xValue, d.y]);
    });

    return Array.from(grouped.entries()).map(([seriesName, seriesData]) => ({
      name: seriesName,
      type: "line" as const,
      symbol: "none" as const,
      smooth: true,
      showSymbol: false,
      data: seriesData,
      color: colorsMap[seriesName as keyof typeof colorsMap],
    }));
  }, [data]);

  useEffect(() => {
    if (!instanceRef.current) return;

    const chart = instanceRef.current;

    const option: echarts.EChartsOption = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "time",
      },
      yAxis: {
        type: "value",
        scale: true,
      },
      series: seriesData,
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
        },
      ],
    };

    chart.setOption(option);
  }, [seriesData, title]);

  return (
    <div
      ref={chartRef}
      style={{
        width,
        height,
      }}
    />
  );
};
