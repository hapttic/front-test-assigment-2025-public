import { useState } from "react";
import { AggregationControls } from "./components";
import type { AggregationLevel } from "./types";

function App() {
  const [aggregation, setAggregation] = useState<AggregationLevel>("hourly");

  return (
    <main className="">
      <AggregationControls
        aggregation={aggregation}
        onAggregationChange={(val) => setAggregation(val)}
      />
    </main>
  );
}

export default App;
