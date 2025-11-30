import { useMemo, useState } from "react";
import AggregationControl from "./components/AggregationControl";
import { AggregationType } from "./types/types";
import TimelineChartSection from "./components/TimelineChartSection";
import useDataFetch from "./hooks/useDataFetch";
import { aggregateMetrics } from "./utils/dataAggregation";

function App() {
  const { data, loading, error } = useDataFetch();
  const [aggregationType, setAggregationType] = useState<AggregationType>(
    AggregationType.HOURLY
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
    <main>
      <AggregationControl
        aggregationType={aggregationType}
        setAggregationType={setAggregationType}
      />
      <TimelineChartSection
        aggregationType={aggregationType}
        metrics={aggregatedData}
      />
    </main>
  );
}

export default App;
