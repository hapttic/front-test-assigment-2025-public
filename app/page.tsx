"use client";

import { useDashboardStore } from "./store/useDashboardStore";
import { useAnalytics } from "./modules/useAnalytics";
import { AggregationControls } from "./components/AggregationControls/AggregationControls";

import { DataGrid } from "./components/DataGrid/DataGrid";
import { TimelineChart } from "./components/TimelineChart/TimelineChart";

export default function Page() {
  const mode = useDashboardStore((s) => s.mode);
  const { data, loading, error } = useAnalytics(mode);

  return (
    <div style={{ padding: 30 }}>
      <h1>Test Aggregation Controls</h1>

      <AggregationControls />

      <p>
        Current mode: <strong>{mode}</strong>
      </p>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {data && (
        <>
          <h2 style={{ marginTop: 40 }}>Revenue</h2>
          <TimelineChart data={data} mode={mode} metric="revenue" />
        </>
      )}
      {data && <DataGrid rows={data} />}


    </div>
  );
}
