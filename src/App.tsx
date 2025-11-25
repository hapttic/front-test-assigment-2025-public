import { useState } from "react";
import Header from "./components/Header"
import KPIStats from "./components/stats/KPIStats"
import TimeIntervalSelector from "./components/TimeIntervalSelector"
import type { TimeInterval } from "./types";

function App() {

  const [timeFilter, setTimeFilter] = useState<TimeInterval>('daily');

  return (
    <div className="bg-[#114341] w-full min-h-screen">
      <Header />
      <div className="w-max-7xl flex justify-end px-4 my-6">
        <TimeIntervalSelector current={timeFilter} onChange={(newLevel) => setTimeFilter(newLevel)} />
      </div>
      <KPIStats totalRevenue={12345} totalClicks={6789} totalImpressions={101112} />
    </div>
  )
}

export default App
