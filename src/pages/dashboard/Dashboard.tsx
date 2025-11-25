import { useSearchParams } from "react-router-dom";
import Wrapper from "../../components/shared/Wrapper";
import AggregationControls from "./components/AggregationControls";
import CampaignMetrics from "./components/CampaignMetrics";
import MetricControls from "./components/MetricControls";
import Header from "./components/Header";
import DataGrid from "./components/DataGrid";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const period = searchParams.get("period") || "daily";
  const metric = searchParams.get("metric") || "revenue";

  return (
    <Wrapper className="min-h-screen bg-background space-y-8 py-12">
      <Header />
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-0  sm:items-center sm:justify-between">
        <AggregationControls />
        <MetricControls />
      </div>
      <CampaignMetrics />
      <DataGrid />

      <div>
        <p>{`period: ${period}, metric: ${metric}`}</p>
      </div>
    </Wrapper>
  );
}
