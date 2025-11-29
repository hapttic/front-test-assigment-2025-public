
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { AggregationControls } from './components/AggregationControls';
import { TimelineChart } from './components/TimelineChart';
import { DataGrid } from './components/DataGrid';
import { fetchDataset, joinMetricsWithCampaigns } from './lib/data';
import type { AggregationLevel, AggregatedSlot } from './lib/aggregation';
import { aggregateMetrics } from './lib/aggregation';

function App() {
  const [level, setLevel] = useState<AggregationLevel>('hourly');
  const [metric, setMetric] = useState<'clicks' | 'revenue'>('clicks');
  const [sortBy, setSortBy] = useState<'date' | 'revenue'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<ReturnType<typeof joinMetricsWithCampaigns> | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchDataset()
      .then((ds) => {
        if (!mounted) return;
        const j = joinMetricsWithCampaigns(ds);
        setJoined(j);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || 'Failed to load data');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const displayed = useMemo(() => {
    if (!joined) return [] as AggregatedSlot[];
    return aggregateMetrics(joined, level);
  }, [joined, level]);

  const reaggregate = (newLevel: AggregationLevel) => {
    setLevel(newLevel);
  };

  const onSortChange = (by: 'date' | 'revenue', dir: 'asc' | 'desc') => {
    setSortBy(by);
    setSortDir(dir);
  };

  const sortedDisplay = useMemo(() => {
    const rows = [...displayed];
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.startUTC - b.startUTC;
      else cmp = a.totalRevenue - b.totalRevenue;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [displayed, sortBy, sortDir]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Campaign Performance Dashboard</h1>
          <p className="text-sm text-gray-600">Analyze campaigns over time with dynamic aggregation.</p>
        </header>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <AggregationControls level={level} onChange={reaggregate} />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded mb-4">{error}</div>
        )}

        {loading ? (
          <div className="p-6 bg-white rounded-lg shadow border">Loading...</div>
        ) : (
          <>
            <div className="mb-6">
              <TimelineChart data={displayed} metric={metric} onMetricChange={setMetric} />
            </div>
            <DataGrid rows={sortedDisplay} sortBy={sortBy} sortDir={sortDir} onSortChange={onSortChange} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
