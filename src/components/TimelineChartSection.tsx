import { useState } from "react";
import { MetricType, type TimelineChartProps } from "../types/types";
import MetricTypeControl from "./MetricTypeControl";

function TimelineChartSection({ aggregationType }: TimelineChartProps) {
    const [metricType, setMetricType] = useState<MetricType>(MetricType.REVENUE); 

    return (
        <section>
            <MetricTypeControl metricType={metricType} setMetricType={setMetricType} />
            <div>Aggregation: {aggregationType}, Metric: {metricType}</div>
            
        </section>
    );
}

export default TimelineChartSection;