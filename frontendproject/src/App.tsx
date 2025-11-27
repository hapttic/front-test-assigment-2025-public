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
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Campaign Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Analyze campaign performance metrics across different time periods
          </p>
        </header>

        <section className="flex flex-wrap items-center gap-4 p-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <span className="text-slate-400 uppercase tracking-wider text-xs">
                Aggregation
              </span>
              <select
                className="bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer hover:bg-slate-800"
                value={aggregation}
                onChange={(event) =>
                  setAggregation(event.target.value as AggregationLevel)
                }
              >
                {aggregationOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-800">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <span className="text-slate-400 uppercase tracking-wider text-xs">
                Metric
              </span>
              <select
                className="bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer hover:bg-slate-800"
                value={metric}
                onChange={(event) =>
                  setMetric(event.target.value as MetricType)
                }
              >
                <option value="clicks" className="bg-slate-800">
                  Clicks
                </option>
                <option value="revenue" className="bg-slate-800">
                  Revenue
                </option>
              </select>
            </label>
          </div>
        </section>

        <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 sm:p-8 shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                {metric === "clicks" ? "Clicks" : "Revenue"} Over Time
              </h2>
              <p className="text-xs text-slate-400">
                Performance metrics by {aggregation} aggregation
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm">Loading data...</p>
              </div>
            </div>
          ) : (
            <BarChart data={aggregatedData} metric={metric} />
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">
                ⚠️ Something went wrong: {error}
              </p>
            </div>
          )}
        </section>

        <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 sm:p-8 shadow-2xl transition-all hover:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Performance Data
              </h2>
              <p className="text-xs text-slate-400">
                Detailed metrics for each time period
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm">Loading data...</p>
              </div>
            </div>
          ) : (
            <DataTable data={aggregatedData} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
