import { useState, useMemo } from "react";
import type { AggregatedData } from "../types";

interface IProps {
  data: AggregatedData[];
}

type SortField = Exclude<keyof AggregatedData, "period">;
type SortDirection = "asc" | "desc";

const DataGrid = ({ data }: IProps) => {
  const [sortField, setSortField] = useState<SortField>("periodStart");
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
    return [...data].sort((a, b) => {
      if (sortField === "periodStart") {
        const aValue = a.periodStart.getTime();
        const bValue = b.periodStart.getTime();
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (
        sortField === "totalRevenue" ||
        sortField === "totalClicks" ||
        sortField === "totalImpressions"
      ) {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortField === "campaignsActive") {
        const aValue = a.campaignsActive.length;
        const bValue = b.campaignsActive.length;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortField, sortDirection]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-300">↕</span>;
    }

    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  const getHeaderClass = (field: SortField) => {
    const baseClass =
      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors group";
    const isActive = sortField === field;

    if (isActive) {
      return `${baseClass} bg-blue-50 text-blue-700`;
    }

    return `${baseClass} text-gray-500 hover:bg-gray-100`;
  };

  if (!sortedData.length) {
    return (
      <div className="text-center py-12 text-gray-500 italic">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className={getHeaderClass("periodStart")} onClick={() => handleSort("periodStart")}>
              <div className="flex items-center">
                Date
                {renderSortIndicator("periodStart")}
              </div>
            </th>
            <th
              className={getHeaderClass("campaignsActive")}
              onClick={() => handleSort("campaignsActive")}
            >
              <div className="flex items-center">
                Campaigns Active
                {renderSortIndicator("campaignsActive")}
              </div>
            </th>
            <th
              className={getHeaderClass("totalImpressions")}
              onClick={() => handleSort("totalImpressions")}
            >
              <div className="flex items-center">
                Total Impressions
                {renderSortIndicator("totalImpressions")}
              </div>
            </th>
            <th className={getHeaderClass("totalClicks")} onClick={() => handleSort("totalClicks")}>
              <div className="flex items-center">
                Total Clicks
                {renderSortIndicator("totalClicks")}
              </div>
            </th>
            <th className={getHeaderClass("totalRevenue")} onClick={() => handleSort("totalRevenue")}>
              <div className="flex items-center">
                Total Revenue
                {renderSortIndicator("totalRevenue")}
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.period}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {row.campaignsActive.length} active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.totalImpressions.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.totalClicks.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                $
                {row.totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Sorted by: <span className="font-medium">{sortField}</span> ({sortDirection})
      </div>
    </div>
  );
};

export default DataGrid;
