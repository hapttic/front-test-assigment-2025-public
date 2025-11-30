import { useState } from "react";
import { MetricType, type TimelineChartSectionProps } from "../types/types";
import MetricTypeControl from "./MetricTypeControl";
import TimelineChart from "./TimelineChart";

function TimelineChartSection({ aggregationType }: TimelineChartSectionProps) {
  const [metricType, setMetricType] = useState<MetricType>(MetricType.REVENUE);

  const dummyData = [
    { timestamp: "2024-01-01T00:00:00Z", value: 20 },
    { timestamp: "2024-01-02T00:00:00Z", value: 40 },
    { timestamp: "2024-01-03T00:00:00Z", value: 35 },
    { timestamp: "2024-01-04T00:00:00Z", value: 50 },
    { timestamp: "2024-01-05T00:00:00Z", value: 45 },
  ];

  return (
    <section>
      <MetricTypeControl
        metricType={metricType}
        setMetricType={setMetricType}
      />
      <div>
        Aggregation: {aggregationType}, Metric: {metricType}
      </div>
      <TimelineChart title="Test" data={dummyData} />
    </section>
  );
}

export default TimelineChartSection;
