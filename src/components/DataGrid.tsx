/**
 * DataGrid Component
 * 
 * Displays aggregated campaign data in a sortable table format.
 * Features:
 * - Sortable columns (Date, Total Revenue)
 * - Formatted numbers for readability
 * - Responsive design
 * - Pagination controls for navigating large datasets
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

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
   * Paginated data based on current page and page size
   */
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  /**
   * Calculate total pages
   */
  const totalPages = Math.ceil(sortedData.length / pageSize);

  /**
   * Reset to page 1 when page size changes
   */
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  /**
   * Handles column header clicks for sorting
   */
  const handleSort = (column: SortableColumn) => {
    setCurrentPage(1); // Reset to first page when sorting changes
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
    <div className="space-y-4">
      {/* Pagination Controls - Top */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>rows per page</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-700">
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Date Column - Sortable */}
            <th
              onClick={() => handleSort('date')}
              className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-tight sm:tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <span>Date</span>
                {renderSortIcon('date')}
              </div>
            </th>

            {/* Campaigns Active */}
            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-tight sm:tracking-wider">
              <span className="hidden lg:inline">Campaigns Active</span>
              <span className="hidden sm:inline lg:hidden">Campaigns</span>
              <span className="sm:hidden">Camp.</span>
            </th>

            {/* Total Impressions */}
            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-tight sm:tracking-wider">
              <span className="hidden lg:inline">Total Impressions</span>
              <span className="hidden sm:inline lg:hidden">Impressions</span>
              <span className="sm:hidden">Impr.</span>
            </th>

            {/* Total Clicks */}
            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-tight sm:tracking-wider">
              <span className="hidden sm:inline">Total Clicks</span>
              <span className="sm:hidden">Clicks</span>
            </th>

            {/* Total Revenue - Sortable */}
            <th
              onClick={() => handleSort('totalRevenue')}
              className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-tight sm:tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="hidden lg:inline">Total Revenue</span>
                <span className="hidden sm:inline lg:hidden">Revenue</span>
                <span className="sm:hidden">Rev.</span>
                {renderSortIcon('totalRevenue')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row, index) => (
            <tr
              key={row.date}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {/* Date */}
              <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900">
                {formatDate(row.date, aggregationLevel)}
              </td>

              {/* Campaigns Active */}
              <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-[10px] sm:text-xs md:text-sm text-gray-700">
                {row.campaignsActive}
              </td>

              {/* Total Impressions */}
              <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-[10px] sm:text-xs md:text-sm text-gray-700">
                {formatNumber(row.totalImpressions)}
              </td>

              {/* Total Clicks */}
              <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-[10px] sm:text-xs md:text-sm text-gray-700">
                {formatNumber(row.totalClicks)}
              </td>

              {/* Total Revenue */}
              <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900">
                {formatCurrency(row.totalRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Pagination Controls - Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
