import { useState } from "react";
import { MetricType, type TimelineChartSectionProps } from "../types/types";
import MetricTypeControl from "./MetricTypeControl";
import TimelineChart from "./TimelineChart";
import Section from "./Section";

function TimelineChartSection({
  metrics,
}: TimelineChartSectionProps) {
  const [metricType, setMetricType] = useState<MetricType>(MetricType.REVENUE);

  return (
    <Section className="py-5 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Revenue Over Time </h2>
          <p className="text-sm text-zinc-400">Aggregated view of revenue across all campaigns.</p>
        </div>
        <MetricTypeControl
          metricType={metricType}
          setMetricType={setMetricType}
          />
      </div>
      
      <TimelineChart data={metrics} metricType={metricType} />
    </Section>
  );
}

export default TimelineChartSection;
