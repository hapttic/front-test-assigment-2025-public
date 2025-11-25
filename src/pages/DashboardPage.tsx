import { useEffect } from "react";
import AggregationToggle from "../components/AggregationToggle";
import DataGrid from "../components/DataGrid";
import LineChartSVG from "../components/LineChartSVG";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAndAggregate } from "../store/slices/metricsSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const aggregation = useAppSelector((s) => s.ui.aggregation);
  const { rows, loading, error } = useAppSelector((s) => s.metrics);

  useEffect(() => {
    dispatch(fetchAndAggregate({ aggregation }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Campaign Performance</h2>
        <AggregationToggle />
      </div>

      {loading && <div className="p-6 bg-white rounded shadow">Loading...</div>}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      {!loading && rows.length === 0 && (
        <div className="p-6 bg-white rounded shadow">
          No data for the selected aggregation.
        </div>
      )}

      {!loading && rows.length > 0 && (
        <>
          <LineChartSVG rows={rows} metric="revenue" />
          <DataGrid rows={rows} />
        </>
      )}
    </div>
  );
}
