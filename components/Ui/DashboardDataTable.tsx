"use client";
import {
  AggregatedData,
  AnalyticsApiResponse,
  DataFilters,
} from "@/lib/interfaces/types";
import { useMemo, useState } from "react";
import Loading from "./Loading";

const DashboardDataTable = ({
  filters,
  setFilters,
  analyticsData,
  response,
  isLoading,
}: {
  analyticsData: AggregatedData[];
  filters: DataFilters;
  setFilters: React.Dispatch<React.SetStateAction<DataFilters>>;
  response: AnalyticsApiResponse;
  isLoading: boolean;
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AggregatedData;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return analyticsData;

    return [...analyticsData].sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = a[key];
      let valB = b[key];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [analyticsData, sortConfig]);

  const requestSort = (key: keyof AggregatedData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const goToPage = (page: number) => {
    if (response) {
      if (page < 1 || page > response?.total) return;
      setFilters((prev) => ({ ...prev, pageNumber: page }));
    }
  };
  return (
    <div className="p-6">
      {!isLoading ? (
        <div className="shadow-lg rounded-xl p-4 bg-white">
          <div className="overflow-x-auto max-h-[65vh] rounded-lg">
            <table className="min-w-full divide-y divide-cyan-200">
              <thead className="bg-cyan-100 sticky top-0">
                <tr>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-cyan-900 select-none hover:text-cyan-700 transition-colors"
                    onClick={() => requestSort("period")}
                  >
                    Date
                    {sortConfig?.key === "period"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-900 select-none hover:text-cyan-700 transition-colors">
                    Campaigns Active
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-900 select-none hover:text-cyan-700 transition-colors">
                    Total Impressions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-900 select-none hover:text-cyan-700 transition-colors">
                    Total Clicks
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-cyan-900 select-none hover:text-cyan-700 transition-colors"
                    onClick={() => requestSort("totalRevenue")}
                  >
                    Total Revenue
                    {sortConfig?.key === "totalRevenue"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cyan-200">
                {sortedData.map((row: AggregatedData, idx: number) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-cyan-50" : "bg-white"
                    } hover:bg-cyan-100`}
                  >
                    <td className="px-4 py-2 text-cyan-900 font-medium">
                      {row.period}
                    </td>
                    <td className="px-4 py-2 text-cyan-800">
                      {row.campaignsActive}
                    </td>
                    <td className="px-4 py-2 text-cyan-800">
                      {row.totalImpressions}
                    </td>
                    <td className="px-4 py-2 text-cyan-800">
                      {row.totalClicks}
                    </td>
                    <td className="px-4 py-2 text-cyan-800">
                      {row.totalRevenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filters.pageNumber && filters.pageSize && response ? (
            <div className="mt-4 flex justify-center items-center gap-3">
              <button
                disabled={filters.pageNumber === 1}
                onClick={() => goToPage(filters.pageNumber - 1)}
                className="cursor-pointer px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-cyan-900 font-semibold">
                Page {filters.pageNumber} /{" "}
                {Math.ceil(response.total / filters.pageSize)}
              </span>
              <button
                disabled={
                  filters.pageNumber ===
                  Math.ceil(response.total / filters.pageSize)
                }
                onClick={() => goToPage(filters.pageNumber + 1)}
                className="cursor-pointer px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default DashboardDataTable;
