"use client";
import { useMemo, useState } from "react";
import { DataFilters } from "@/lib/interfaces/types";
import { useFetchAnalytics } from "@/hooks/useFetchAnalytics";
import DashboardDataTable from "../Ui/DashboardDataTable";

const Dashboard = () => {
  const [filters, setFilters] = useState<DataFilters>({
    pageNumber: 1,
    pageSize: 50,
    aggregationType: "hourly",
  });

  const { data: response, isLoading, isFetching } = useFetchAnalytics(filters);

  const analyticsData = useMemo(() => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    return response.data;
  }, [response]);

  return (
    <div className="p-6 bg-cyan-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-extrabold text-cyan-900 mb-6 drop-shadow-md">
          Dashboard
        </h1>

        {/* aggregation options */}
        <div className="flex items-center gap-2 mb-6">
          <select
            id="aggregation"
            className="px-3 py-2 border rounded-lg bg-white text-cyan-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 hover:bg-cyan-50"
            value={filters.aggregationType}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                aggregationType: e.target
                  .value as DataFilters["aggregationType"],
                pageNumber: 1,
              }))
            }
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      {/* data table */}

      <DashboardDataTable
        response={response ? response : { data: [], total: 0 }}
        analyticsData={analyticsData}
        isLoading={isLoading || isFetching}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default Dashboard;
