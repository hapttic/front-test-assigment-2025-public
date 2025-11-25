import Wrapper from "../../components/shared/Wrapper";
import CampaignMetrics from "./components/CampaignMetrics";

export default function Dashboard() {
  return (
    <Wrapper className="min-h-screen bg-background">
      <CampaignMetrics />
    </Wrapper>
  );
}
