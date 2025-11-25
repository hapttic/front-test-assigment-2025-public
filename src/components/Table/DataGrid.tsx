import React from "react";
import "./DataGrid.scss";

const DataGrid: React.FC = () => {
  return (
    <div className="data-grid-container">
      <h3>Campaign Data</h3>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable">Date ↕</th>
              <th>Campaigns Active</th>
              <th>Total Impressions</th>
              <th>Total Clicks</th>
              <th className="sortable">Total Revenue ↕</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2023-10-01</td>
              <td>5</td>
              <td>12,500</td>
              <td>450</td>
              <td>$1,200.50</td>
            </tr>
            <tr>
              <td>2023-10-02</td>
              <td>4</td>
              <td>10,200</td>
              <td>380</td>
              <td>$980.00</td>
            </tr>
            <tr>
              <td>2023-10-03</td>
              <td>6</td>
              <td>15,100</td>
              <td>520</td>
              <td>$1,450.25</td>
            </tr>
            <tr>
              <td colSpan={5} className="empty-state">
                Select aggregation to view data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataGrid;
