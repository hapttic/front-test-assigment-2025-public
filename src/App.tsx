import { useState } from "react"
import AggregationControl from "./components/AggregationControl"
import { AggregationType } from "./types/types";

function App() {
  const [aggregationType, setAggregationType] = useState<AggregationType>(AggregationType.HOURLY);

  return (
    <>
      <AggregationControl aggregationType={aggregationType} setAggregationType={setAggregationType} />
      {aggregationType}
    </>
  )
}

export default App
