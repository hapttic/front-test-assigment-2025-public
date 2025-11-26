import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../lib/utils";
import type { MetricEnum } from "../../../lib/types";
import Button from "../../../components/shared/Button";

export default function MetricControls() {
  const [searchParams, setSearchParams] = useSearchParams("");
  const metric: MetricEnum =
    (searchParams.get("metric") as MetricEnum) || "revenue";

  const [selectedMetric, setSelectedMetric] = useState<MetricEnum>(metric);

  function handleChangeMetric(metric: MetricEnum) {
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
          <Button
            key={metric}
            onClick={() => handleChangeMetric(metric)}
            className={` ${
              metric !== selectedMetric && "text-muted-foreground"
            } `}
            variant={metric === selectedMetric ? "primary" : "ghost"}
          >
            {capitalizeFirstLetter(metric)}
          </Button>
        ))}
      </div>
    </div>
  );
}
