import { useState } from "react"
import AggregationControl from "./components/AggregationControl"
import { AggregationType } from "./types/types";
import TimelineChartSection from "./components/TimelineChartSection";

function App() {
  const [aggregationType, setAggregationType] = useState<AggregationType>(AggregationType.HOURLY);

  return (
    <main>
      <AggregationControl aggregationType={aggregationType} setAggregationType={setAggregationType} />
      <TimelineChartSection aggregationType={aggregationType} />
    </main>
  )
}

export default App
