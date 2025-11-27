import React, { useState, useMemo } from "react";
import "./DataGrid.scss";
import type { AggregatedDataPoint } from "../../utils/dataProcessor";

interface DataGridProps {
  data: AggregatedDataPoint[];
}

type SortField = "timestamp" | "revenue";
type SortDirection = "asc" | "desc";

const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      const valA = sortField === "timestamp" ? a.timestamp : a.revenue;
      const valB = sortField === "timestamp" ? b.timestamp : b.revenue;
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  }, [data, sortField, sortDirection]);

  return (
    <div className="data-grid-container">
      <h3>Campaign Data</h3>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("timestamp")}>
                Date{" "}
                {sortField === "timestamp"
                  ? (sortDirection === "asc" ? "↑" : "↓")
                  : "↕"}
              </th>
              <th>Campaigns Active</th>
              <th>Total Impressions</th>
              <th>Total Clicks</th>
              <th className="sortable" onClick={() => handleSort("revenue")}>
                Total Revenue{" "}
                {sortField === "revenue"
                  ? (sortDirection === "asc" ? "↑" : "↓")
                  : "↕"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr key={row.timestamp}>
                  <td>{row.label}</td>
                  <td>{row.campaignsActive}</td>
                  <td>{row.impressions.toLocaleString()}</td>
                  <td>{row.clicks.toLocaleString()}</td>
                  <td>
                    $
                    {row.revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataGrid;
