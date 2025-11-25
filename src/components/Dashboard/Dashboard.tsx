import React, { useState, useEffect, useMemo } from "react";
import AggregationControls from "../Controls/AggregationControls";
import TimelineChart from "../Chart/TimelineChart";
import DataGrid from "../Table/DataGrid";
import "./Dashboard.scss";
import { fetchData, aggregateData } from "../../utils/dataProcessor";
import type { RawData, AggregationType } from "../../utils/dataProcessor";

type MetricType = "Clicks" | "Revenue";

const Dashboard: React.FC = () => {
  const [aggregation, setAggregation] = useState<AggregationType>("Daily");
  const [metric, setMetric] = useState<MetricType>("Clicks");
  const [rawData, setRawData] = useState<RawData | null>(null);

  useEffect(() => {
    fetchData().then(setRawData).catch(console.error);
  }, []);

  const chartData = useMemo(() => {
    if (!rawData) return [];
    return aggregateData(rawData.metrics, aggregation);
  }, [rawData, aggregation]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-section">
          <div className="logo-icon">D</div>
          <h1>Dashboard</h1>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="controls-section">
          <AggregationControls
            selected={aggregation}
            onSelect={setAggregation}
          />
        </div>
        <div className="chart-section">
          <TimelineChart
            data={chartData}
            selectedMetric={metric}
            onSelectMetric={setMetric}
          />
        </div>
        <div className="grid-section">
          <DataGrid data={chartData} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
