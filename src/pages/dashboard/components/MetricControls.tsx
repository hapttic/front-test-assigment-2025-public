import { useState } from "react";
import { useSearchParams } from "react-router-dom";

type MetricType = "clicks" | "revenue";

export default function MetricControls() {
  const [searchParams, setSearchParams] = useSearchParams("");
  const metric: MetricType =
    (searchParams.get("metric") as MetricType) || "revenue";

  const [selectedMetric, setSelectedMetric] = useState<MetricType>(metric);

  function handleChangeMetric(metric: MetricType) {
    setSelectedMetric(metric);

    if (metric === "revenue") {
      searchParams.delete("metric");
    } else {
      searchParams.set("metric", metric);
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-foreground">Metric:</label>
      <div className="flex rounded-lg border border-border bg-card p-1">
        {(["clicks", "revenue"] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => handleChangeMetric(metric)}
            className={`rounded-md px-4 py-2 text-sm cursor-pointer font-medium transition-colors ${
              selectedMetric === metric
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
