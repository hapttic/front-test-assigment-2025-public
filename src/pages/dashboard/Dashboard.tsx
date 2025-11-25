import Wrapper from "../../components/shared/Wrapper";
import AggregationPeriod from "./components/AggregationPeriod";
import CampaignMetrics from "./components/CampaignMetrics";
import Metrics from "./components/Metrics";

export default function Dashboard() {
  return (
    <Wrapper className="min-h-screen bg-background space-y-8 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-0  sm:items-center sm:justify-between">
        <AggregationPeriod />
        <Metrics />
      </div>
      <CampaignMetrics />
    </Wrapper>
  );
}
