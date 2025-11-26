import { useState } from "react";
import Header from "./components/Header"
import KPIStats from "./components/stats/KPIStats"
import TimeIntervalSelector from "./components/TimeIntervalSelector"
import type { TimeInterval } from "./types";
import CampaignPerformanceTable from "./components/campaign-table/CampaignPerformanceTable";
import SocialStats from "./components/stats/SocialStats";

function App() {

  const [timeFilter, setTimeFilter] = useState<TimeInterval>('daily');

  return (
    <div className="bg-[#114341] w-full min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 px-4 my-6">
        <h1 className="text-black text-2xl font-bold uppercase bg-[#37e6aa] px-4 py-2 rounded-lg">
          Campaign Analytics
        </h1>
        <TimeIntervalSelector 
          current={timeFilter} 
          onChange={(newLevel) => setTimeFilter(newLevel)} 
        />
      </div>
      <KPIStats totalRevenue={12345} totalClicks={6789} totalImpressions={101112} />
      <SocialStats totalRevenue={12345} totalClicks={6789} totalImpressions={101112} />
      <CampaignPerformanceTable  />
    </div>
  )
}

export default App
