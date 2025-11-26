import { useState } from "react";
import { useFetchCampaignData } from "../hooks/useFetchCampaignData";
import DataTable from "../components/DataTable";
import { useAggregatedMetrics } from "../hooks/useAggregatedMetrics";
import AggregationFilter from "../components/AggregationFilter";
import Chart from "../components/Chart";

export default function Dashboard() {
  // const [aggregation, setAggregation] = useState<
  //   "hourly" | "daily" | "weekly" | "monthly"
  // >("daily");
  const [mode, setMode] = useState<"hourly" | "daily" | "weekly" | "monthly">(
    "daily"
  );
  const { metrics } = useFetchCampaignData();
  const aggregated = useAggregatedMetrics(metrics, mode);
  return (
    <main className="w-full space-y-10">
      <div className="flex">
        <div className="ml-auto">
          {/* <select
            //onChange={(e) => setAggregation(e.target.value as any)}
            value={mode}
            onChange={(e) =>
              setMode(
                e.target.value as "hourly" | "daily" | "weekly" | "monthly"
              )
            }
            className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm shadow-sm cursor-pointer focus:outline-none focus:border-none  "
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select> */}
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
