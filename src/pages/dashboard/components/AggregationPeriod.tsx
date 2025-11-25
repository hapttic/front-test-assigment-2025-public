import { useState } from "react";
import type { AggregationPeriod } from "../../../lib/types";

export default function AggregationPeriod() {
  const [aggregationPeriod, setAggregationPeriod] =
    useState<AggregationPeriod>("daily");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-foreground">
        Time Period:
      </label>
      <div className="flex rounded-lg border border-border bg-card p-1">
        {(["hourly", "daily", "weekly", "monthly"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setAggregationPeriod(period)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              aggregationPeriod === period
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
