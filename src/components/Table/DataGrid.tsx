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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  return (
    <div className="data-grid-container">
      <div className="grid-header">
        <h3>Campaign Data</h3>
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            &lt;
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("timestamp")}>
                Date{" "}
                {sortField === "timestamp"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>
              <th>Campaigns Active</th>
              <th>Total Impressions</th>
              <th>Total Clicks</th>
              <th className="sortable" onClick={() => handleSort("revenue")}>
                Total Revenue{" "}
                {sortField === "revenue"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
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
