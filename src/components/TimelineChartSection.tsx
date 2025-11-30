import { useState } from "react";
import { MetricType, type TimelineChartSectionProps } from "../types/types";
import MetricTypeControl from "./MetricTypeControl";
import TimelineChart from "./TimelineChart";

function TimelineChartSection({
  aggregationType,
  metrics,
}: TimelineChartSectionProps) {
  const [metricType, setMetricType] = useState<MetricType>(MetricType.REVENUE);

  return (
    <section>
      <MetricTypeControl
        metricType={metricType}
        setMetricType={setMetricType}
      />
      <div>
        Aggregation: {aggregationType}, Metric: {metricType}
      </div>
      <TimelineChart title="Test" data={metrics} metricType={metricType} />
    </section>
  );
}

export default TimelineChartSection;
