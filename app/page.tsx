"use client";
import styles from "./page.module.css";

import { useDashboardStore } from "./store/useDashboardStore";
import { useAnalytics } from "./modules/useAnalytics";
import { AggregationControls } from "./components/AggregationControls/AggregationControls";

import { DataGrid } from "./components/DataGrid/DataGrid";
import { TimelineChart } from "./components/TimelineChart/TimelineChart";

export default function Page() {
  const mode = useDashboardStore((s) => s.mode);
  const { data, loading, error } = useAnalytics(mode);

  return (
    <div className={styles.wrapper}>
      <div className={styles.Analytics} >
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Track your campaign performance over time</p>
        </div>

        <div>
          <AggregationControls />
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
        </div>
      </div>

      {data && (
        <>
          <h2 style={{ marginTop: 40 }}>Revenue</h2>
          <TimelineChart data={data} mode={mode} metric="revenue" />
        </>
      )}
      <div className={styles.DataGrid} >
        <h2>Campaign Performance Dashboard</h2>
        <p>View and analyze your advertising campaign metrics</p>
        {data && <DataGrid rows={data} />}
      </div>
    </div>
  );
}
