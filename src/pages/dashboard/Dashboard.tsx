import { useSearchParams } from "react-router-dom";
import Wrapper from "../../components/shared/Wrapper";
import AggregationPeriod from "./components/AggregationPeriod";
import CampaignMetrics from "./components/CampaignMetrics";
import Metrics from "./components/Metrics";
import Header from "./components/Header";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const period = searchParams.get("period") || "daily";
  const metric = searchParams.get("metric") || "revenue";

  return (
    <Wrapper className="min-h-screen bg-background space-y-8 py-12">
      <Header />
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-0  sm:items-center sm:justify-between">
        <AggregationPeriod />
        <Metrics />
      </div>
      <CampaignMetrics />
      <div>
        <p>Period: {period}</p>
        <p>Metric: {metric}</p>
      </div>
    </Wrapper>
  );
}
