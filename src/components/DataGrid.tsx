import { useMemo, useState } from 'react';
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(0);

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

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(pageIndex, totalPages - 1);
  const start = current * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = sorted.slice(start, end);

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
          <div className="flex items-center gap-2 ml-4">
            <span>Rows per page:</span>
            <select
              className="border rounded px-2 py-1"
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPageSize(next);
                setPageIndex(0);
              }}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
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
          {paged.map((r) => (
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
      <div className="flex items-center justify-between p-3 border-t text-sm">
        <div>
          Showing <strong>{total === 0 ? 0 : start + 1}</strong>–<strong>{end}</strong> of <strong>{total}</strong>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={current === 0}
            onClick={() => setPageIndex(0)}
          >
            First
          </button>
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={current === 0}
            onClick={() => setPageIndex(Math.max(0, current - 1))}
          >
            Prev
          </button>
          <span>Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={current + 1}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!Number.isNaN(val)) setPageIndex(Math.min(totalPages - 1, Math.max(0, val - 1)));
            }}
            className="w-14 px-2 py-1 border rounded"
          />
          <span>of {totalPages}</span>
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={current + 1 >= totalPages}
            onClick={() => setPageIndex(Math.min(totalPages - 1, current + 1))}
          >
            Next
          </button>
          <button
            className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={current + 1 >= totalPages}
            onClick={() => setPageIndex(totalPages - 1)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

