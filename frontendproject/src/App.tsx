import { useEffect, useMemo, useState } from "react";
import "./App.css";
import type {
  AggregationLevel,
  Campaign,
  MetricRecord,
  RawDataFile,
} from "./types/data";
import { aggregateMetrics } from "./utils/aggregation";
import BarChart from "./components/barChart";
import DataTable from "./components/DataTable";

const aggregationOptions: AggregationLevel[] = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
];

type MetricType = "clicks" | "revenue";

function App() {
  const [aggregation, setAggregation] = useState<AggregationLevel>("daily");
  const [metric, setMetric] = useState<MetricType>("clicks");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch raw data on mount and join/merge campaigns with metrics
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/data.json");
        const data: RawDataFile = await res.json();

        const campaignsData = data.campaigns ?? [];
        const metricsData = data.metrics ?? [];

        // merge campaigns and metrics
        setCampaigns(campaignsData);
        setMetrics(metricsData);

        // Total campaigns: ${campaignsData.length}, Total metrics: ${metricsData.length}
      } catch (error: any) {
        console.log("Error,", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  void campaigns.length;

  // memoize aggregation
  const aggregatedData = useMemo(
    () => aggregateMetrics(metrics, aggregation),
    [metrics, aggregation]
  );

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
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-300 uppercase tracking-wide">
              Metric
            </span>
            <select
              className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
              value={metric}
              onChange={(event) => setMetric(event.target.value as MetricType)}
            >
              <option value="clicks">Clicks</option>
              <option value="revenue">Revenue</option>
            </select>
          </label>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">
            {metric === "clicks" ? "Clicks" : "Revenue"} over time
          </h2>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading data...</p>
          ) : (
            <BarChart data={aggregatedData} metric={metric} />
          )}
          {error && (
            <p className="bg-red-600 text-sm mt-2">
              Something went wrong {error}
            </p>
          )}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Performance Data</h2>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading data...</p>
          ) : (
            <DataTable data={aggregatedData} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
