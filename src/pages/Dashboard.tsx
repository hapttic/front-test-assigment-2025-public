import { useState } from "react";
import { useFetchCampaignData } from "../hooks/useFetchCampaignData";
import DataTable from "../components/DataTable";

export default function Dashboard() {
  const [aggregation, setAggregation] = useState<
    "hourly" | "daily" | "weekly" | "monthly"
  >("daily");
  const { metrics } = useFetchCampaignData();
  return (
    <main className="w-full">
      <div className="flex">
        <div className="ml-auto">
          {/* <button>{aggregation}</button> */}
          <select
            onChange={(e) => setAggregation(e.target.value as any)}
            className="w-20"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <DataTable rows={metrics} />
    </main>
  );
}
