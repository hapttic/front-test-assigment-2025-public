import  { useMemo } from 'react';
import type { AggregatedSlot } from '../lib/aggregation';

type SortBy = 'date' | 'revenue';
type SortDir = 'asc' | 'desc';

interface Props {
  rows: AggregatedSlot[];
  sortBy: SortBy;
  sortDir: SortDir;
  onSortChange: (by: SortBy, dir: SortDir) => void;
}

export function DataGrid({ rows, sortBy, sortDir, onSortChange }: Props) {
  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.startUTC - b.startUTC;
      else cmp = a.totalRevenue - b.totalRevenue;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortBy, sortDir]);

  const toggle = (by: SortBy) => {
    if (sortBy === by) onSortChange(by, sortDir === 'asc' ? 'desc' : 'asc');
    else onSortChange(by, 'asc');
  };

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-semibold text-gray-800">Aggregated Metrics</h3>
        <div className="flex items-center gap-2 text-sm">
          <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={() => toggle('date')}>
            Sort by Date {sortBy === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={() => toggle('revenue')}>
            Sort by Revenue {sortBy === 'revenue' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600">Campaigns Active</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600">Total Impressions</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600">Total Clicks</th>
            <th className="text-right px-3 py-2 font-medium text-gray-600">Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.startUTC} className="even:bg-white odd:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">{r.label}</td>
              <td className="px-3 py-2 text-right">{r.campaignsActive}</td>
              <td className="px-3 py-2 text-right">{r.totalImpressions.toLocaleString()}</td>
              <td className="px-3 py-2 text-right">{r.totalClicks.toLocaleString()}</td>
              <td className="px-3 py-2 text-right">${r.totalRevenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

