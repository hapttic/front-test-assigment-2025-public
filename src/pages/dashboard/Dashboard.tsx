import Wrapper from "../../components/shared/Wrapper";
import AggregationControls from "./components/AggregationControls";
import CampaignMetrics from "./components/CampaignMetrics";
import MetricControls from "./components/MetricControls";
import Header from "./components/Header";
import DataGrid from "./components/DataGrid";
import useAggrigatedData from "../../lib/hooks/useAggrigatedData";
import Chart from "./components/Chart";
import { useState } from "react";

export default function Dashboard() {
  const { data: aggregatedData, period, metric } = useAggrigatedData();
  const [count, setCount] = useState(0);

  return (
    <Wrapper className="min-h-screen bg-background space-y-8 py-12">
      {/* just to check if other components are re-rendering */}
      <button
        className="bg-primary px-4 py-2 rounded-lg cursor-pointer text-primary-foreground hover:bg-primary/80 transition-all duration-300"
        onClick={() => setCount((c) => c + 1)}
      >
        count is: {count}
      </button>

      <Header />
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-0  sm:items-center sm:justify-between">
        <AggregationControls />
        <MetricControls />
      </div>

      <CampaignMetrics data={aggregatedData} />
      <Chart data={aggregatedData} metric={metric} period={period} />
      <DataGrid data={aggregatedData} period={period} />
    </Wrapper>
  );
}
