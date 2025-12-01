import { useState } from "react";
import { useFetchCampaignData } from "../hooks/useFetchCampaignData";
import DataTable from "../components/DataTable";
import { useAggregatedMetrics } from "../hooks/useAggregatedMetrics";
import AggregationFilter from "../components/AggregationFilter";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [mode, setMode] = useState<"hourly" | "daily" | "weekly" | "monthly">(
    "daily"
  );
  const { metrics } = useFetchCampaignData();
  const aggregated = useAggregatedMetrics(metrics, mode);
  return (
    <main className="w-full space-y-10">
      <div className="flex">
        <div className="ml-auto">
          <AggregationFilter
            value={mode}
            onChange={setMode}
            options={["hourly", "daily", "weekly", "monthly"]}
          />
        </div>
      </div>
      <Chart data={aggregated} aggregation={mode} />
      <DataTable
        rows={aggregated}
        //rows={metrics}
      />
    </main>
  );
}
