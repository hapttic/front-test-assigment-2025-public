import { useState } from "react";
import type { AggregatedBucket } from "../types/data";

type DataTableProps = {
  data: AggregatedBucket[];
};

type SortField = "date" | "revenue" | null;
type SortDirection = "asc" | "desc";

export default function DataTable({ data }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // sort depending on given field
  const handleSort = (field: "date" | "revenue") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    if (sortField === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === "revenue") {
      comparison = a.totalRevenue - b.totalRevenue;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (num: number) => `$${num.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    // format to display nice date
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-linear-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm z-10 border-b border-slate-700/50">
            <tr>
              <th
                className="text-left p-4 text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer transition-colors hover:text-cyan-400 hover:bg-slate-800/50 group"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  {sortField === "date" && (
                    <span className="text-cyan-400 transition-transform">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                  {sortField !== "date" && (
                    <span className="text-slate-600 group-hover:text-slate-500 text-xs">
                      ↕
                    </span>
                  )}
                </div>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Campaigns Active
              </th>
              <th className="text-left p-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Total Impressions
              </th>
              <th className="text-left p-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Total Clicks
              </th>
              <th
                className="text-left p-4 text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer transition-colors hover:text-cyan-400 hover:bg-slate-800/50 group"
                onClick={() => handleSort("revenue")}
              >
                <div className="flex items-center gap-2">
                  Total Revenue
                  {sortField === "revenue" && (
                    <span className="text-cyan-400 transition-transform">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                  {sortField !== "revenue" && (
                    <span className="text-slate-600 group-hover:text-slate-500 text-xs">
                      ↕
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sortedData.map((bucket, _) => (
              <tr
                key={bucket.key}
                className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors duration-150"
              >
                <td className="p-4 text-sm text-slate-200 font-medium">
                  {formatDate(bucket.date)}
                </td>
                <td className="p-4 text-sm text-slate-300">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {bucket.campaignsActive}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-300 font-mono">
                  {formatNumber(bucket.totalImpressions)}
                </td>
                <td className="p-4 text-sm text-slate-300 font-mono">
                  {formatNumber(bucket.totalClicks)}
                </td>
                <td className="p-4 text-sm text-slate-200 font-semibold">
                  <span className="text-green-400">
                    {formatCurrency(bucket.totalRevenue)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
