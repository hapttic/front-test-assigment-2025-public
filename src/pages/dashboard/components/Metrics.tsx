import { useState } from "react";

export default function Metrics() {
  const [selectedMetric, setSelectedMetric] = useState<"clicks" | "revenue">(
    "clicks"
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-foreground">Metric:</label>
      <div className="flex rounded-lg border border-border bg-card p-1">
        {(["clicks", "revenue"] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
