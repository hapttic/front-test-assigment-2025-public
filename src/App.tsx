import { useMemo, useState } from "react";
import AggregationControl from "./components/AggregationControl";
import { AggregationType } from "./types/types";
import TimelineChartSection from "./components/TimelineChartSection";
import useDataFetch from "./hooks/useDataFetch";
import { aggregateMetrics } from "./utils/dataAggregation";
import TableSection from "./components/TableSection";
import Heading from "./components/Heading";

function App() {
  const { data, loading, error } = useDataFetch();
  const [aggregationType, setAggregationType] = useState<AggregationType>(
    AggregationType.DAILY
  );

  const aggregatedData = useMemo(() => {
    if (!data?.metrics) return [];
    return aggregateMetrics(data.metrics, aggregationType);
  }, [data?.metrics, aggregationType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="bg-base container mx-auto px-6 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <Heading />
        <AggregationControl
          aggregationType={aggregationType}
          setAggregationType={setAggregationType}
        />
      </div>
      
      <TimelineChartSection
        metrics={aggregatedData}
      />
      <TableSection 
        metrics={aggregatedData} 
      />
    </main>
  );
}

export default App;
