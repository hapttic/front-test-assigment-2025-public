import type { AggregatedDataPoint, SortField, SortDirection } from '../types';
import './DataGrid.css';

interface DataGridProps {
  data: AggregatedDataPoint[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function DataGrid({ data, sortField, sortDirection, onSort }: DataGridProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="data-grid-container">
      <table className="data-grid">
        <thead>
          <tr>
            <th onClick={() => onSort('period')} className="sortable">
              Date {getSortIcon('period')}
            </th>
            <th className="center">Campaigns Active</th>
            <th onClick={() => onSort('impressions')} className="sortable number">
              Total Impressions {getSortIcon('impressions')}
            </th>
            <th onClick={() => onSort('clicks')} className="sortable number">
              Total Clicks {getSortIcon('clicks')}
            </th>
            <th onClick={() => onSort('revenue')} className="sortable number">
              Total Revenue {getSortIcon('revenue')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="no-data">No data available</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.period}>
                <td>{row.periodLabel}</td>
                <td className="center">
                  <span className="campaign-badge">{row.campaignsActive.size}</span>
                </td>
                <td className="number">
                  <span className="number-value">{formatNumber(row.totalImpressions)}</span>
                </td>
                <td className="number">
                  <span className="number-value">{formatNumber(row.totalClicks)}</span>
                </td>
                <td className="number">
                  <span className="revenue-value">{formatCurrency(row.totalRevenue)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

