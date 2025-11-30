/**
 * DataGrid Component
 * 
 * Displays aggregated campaign data in a sortable table format.
 * Features:
 * - Sortable columns (Date, Total Revenue)
 * - Formatted numbers for readability
 * - Responsive design
 */

import { useState, useMemo } from 'react';
import type { AggregatedDataPoint, AggregationLevel, SortState, SortableColumn } from '../types';
import { formatDate } from '../utils/aggregation';

interface DataGridProps {
  data: AggregatedDataPoint[];
  aggregationLevel: AggregationLevel;
}

export function DataGrid({ data, aggregationLevel }: DataGridProps) {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  /**
   * Sorted data based on current sort state
   * Memoized to prevent unnecessary recalculations
   */
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return data;
    }

    const sorted = [...data];

    if (sortState.column === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortState.direction === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortState.column === 'totalRevenue') {
      sorted.sort((a, b) => {
        return sortState.direction === 'asc'
          ? a.totalRevenue - b.totalRevenue
          : b.totalRevenue - a.totalRevenue;
      });
    }

    return sorted;
  }, [data, sortState]);

  /**
   * Handles column header clicks for sorting
   */
  const handleSort = (column: SortableColumn) => {
    setSortState((prev) => {
      // If clicking the same column, cycle through: asc -> desc -> null
      if (prev.column === column) {
        if (prev.direction === 'asc') return { column, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
      }
      // If clicking a new column, start with ascending
      return { column, direction: 'asc' };
    });
  };

  /**
   * Renders sort indicator icon
   */
  const renderSortIcon = (column: SortableColumn) => {
    if (sortState.column !== column) 
      return <span className="text-gray-400">⇅</span>;
    return sortState.direction === 'asc' ? (
      <span className="text-blue-600">↑</span>
    ) : (
      <span className="text-blue-600">↓</span>
    );
  };

  /**
   * Formats numbers with proper separators
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  /**
   * Formats currency values
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Date Column - Sortable */}
            <th
              onClick={() => handleSort('date')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">
                <span>Date</span>
                {renderSortIcon('date')}
              </div>
            </th>

            {/* Campaigns Active */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Campaigns Active
            </th>

            {/* Total Impressions */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Total Impressions
            </th>

            {/* Total Clicks */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Total Clicks
            </th>

            {/* Total Revenue - Sortable */}
            <th
              onClick={() => handleSort('totalRevenue')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">
                <span>Total Revenue</span>
                {renderSortIcon('totalRevenue')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, index) => (
            <tr
              key={row.date}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {/* Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatDate(row.date, aggregationLevel)}
              </td>

              {/* Campaigns Active */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {row.campaignsActive}
              </td>

              {/* Total Impressions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatNumber(row.totalImpressions)}
              </td>

              {/* Total Clicks */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatNumber(row.totalClicks)}
              </td>

              {/* Total Revenue */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatCurrency(row.totalRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
