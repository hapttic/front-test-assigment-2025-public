import { useEffect, useState } from "react";
import "./App.css";
import type { AggregationLevel, MetricRecord } from "./types/data";
import { aggregateMetrics } from "./utils/aggregation";
import BarChart from "./components/barChart";

const aggregationOptions: AggregationLevel[] = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
];

function App() {
  const [aggregation, setAggregation] = useState<AggregationLevel>("daily");
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch raw data on mount
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/data.json");
        const data = await res.json();
        setMetrics(data.metrics ?? []);
      } catch (error: any) {
        console.log("Error,", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const aggregatedData = aggregateMetrics(metrics, aggregation);

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-300 uppercase tracking-wide">
              Aggregation
            </span>
            <select
              className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
              value={aggregation}
              onChange={(event) =>
                setAggregation(event.target.value as AggregationLevel)
              }
            >
              {aggregationOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Clicks over time</h2>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading data...</p>
          ) : (
            <BarChart data={aggregatedData} />
          )}
          {error && (
            <p className="bg-red-600 text-sm mt-2">
              Something went wrong {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
