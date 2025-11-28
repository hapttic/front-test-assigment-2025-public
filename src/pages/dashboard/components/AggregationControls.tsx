import { useState } from "react";
import type { AggregationPeriod } from "../../../lib/types";
import { useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../lib/utils";
import Button from "../../../components/shared/Button";

export default function AggregationControls() {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = (searchParams.get("period") as AggregationPeriod) || "daily";

  const [aggregationPeriod, setAggregationPeriod] =
    useState<AggregationPeriod>(period);

  function handleChangePeriod(period: AggregationPeriod) {
    setAggregationPeriod(period);
    if (period === "daily") {
      searchParams.delete("period");
    } else {
      searchParams.set("period", period);
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-foreground">
        Time Period:
      </label>
      <div className="flex rounded-lg border border-border bg-card p-1">
        {(["hourly", "daily", "weekly", "monthly"] as const).map((period) => (
          <Button
            key={period}
            onClick={() => handleChangePeriod(period)}
            className={` ${
              aggregationPeriod !== period && "text-muted-foreground"
            } `}
            variant={aggregationPeriod === period ? "primary" : "ghost"}
          >
            {capitalizeFirstLetter(period)}
          </Button>
        ))}
      </div>
    </div>
  );
}
