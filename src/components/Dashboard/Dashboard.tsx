import React, { useState } from "react";
import AggregationControls from "../Controls/AggregationControls";
import TimelineChart from "../Chart/TimelineChart";
import DataGrid from "../Table/DataGrid";
import "./Dashboard.scss";

type AggregationType = "Hourly" | "Daily" | "Weekly" | "Monthly";

const Dashboard: React.FC = () => {
  const [aggregation, setAggregation] = useState<AggregationType>("Daily");

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
          <TimelineChart />
        </div>

        <div className="grid-section">
          <DataGrid />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
