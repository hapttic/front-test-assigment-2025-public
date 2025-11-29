import { useState } from "react";
import { AggregationControls, DataGrid } from "./components";
import type { AggregatedData, AggregationLevel } from "./types";
import { createMockAggregatedData } from "./utils";

function App() {
  const [aggregation, setAggregation] = useState<AggregationLevel>("hourly");

  const mockData: AggregatedData[] = createMockAggregatedData(aggregation);

  return (
    <main className="flex flex-col">
      <AggregationControls
        aggregation={aggregation}
        onAggregationChange={(val) => setAggregation(val)}
      />

      <DataGrid data={mockData} aggregation={aggregation} />
    </main>
  );
}

export default App;
