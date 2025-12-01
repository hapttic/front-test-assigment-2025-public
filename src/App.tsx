import { useEffect, useState } from "react";
import { AggregationControls, DataGrid, TimelineChart, MetricToggle } from "./components";
import type { AggregatedData, AggregationLevel, MetricType } from "./types";
import { aggregateData } from "./utils";
import campaignData from "../data.json";

function App() {
  const [aggregation, setAggregation] = useState<AggregationLevel>("daily");
  const [metric, setMetric] = useState<MetricType>("clicks");
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    (() => {
      const processedData = aggregateData(campaignData, aggregation);
      setAggregatedData(processedData);
    })();
  }, [aggregation]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Analytics Dashboard</h1>
          <p className="text-gray-600">Analyze campaign performance across different time periods</p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <AggregationControls aggregation={aggregation} onAggregationChange={setAggregation} />
          <MetricToggle metric={metric} onMetricChange={setMetric} />
        </div>

        <main className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Timeline - <span className="capitalize">{aggregation}</span> View
            </h2>
            <TimelineChart data={aggregatedData} metric={metric} aggregation={aggregation} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Data - <span className="capitalize">{aggregation}</span> View
            </h2>
            <DataGrid data={aggregatedData} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
