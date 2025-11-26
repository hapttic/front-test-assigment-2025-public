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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th
              className="text-left p-3 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("date")}
            >
              Date
              {sortField === "date" && (
                <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th className="text-left p-3 text-sm font-semibold text-slate-300">
              Campaigns Active
            </th>
            <th className="text-left p-3 text-sm font-semibold text-slate-300">
              Total Impressions
            </th>
            <th className="text-left p-3 text-sm font-semibold text-slate-300">
              Total Clicks
            </th>
            <th
              className="text-left p-3 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("revenue")}
            >
              Total Revenue
              {sortField === "revenue" && (
                <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((bucket) => (
            <tr
              key={bucket.key}
              className="border-b border-slate-800 hover:bg-slate-800/50"
            >
              <td className="p-3 text-sm text-slate-200">{formatDate(bucket.date)}</td>
              <td className="p-3 text-sm text-slate-200">
                {bucket.campaignsActive}
              </td>
              <td className="p-3 text-sm text-slate-200">
                {formatNumber(bucket.totalImpressions)}
              </td>
              <td className="p-3 text-sm text-slate-200">
                {formatNumber(bucket.totalClicks)}
              </td>
              <td className="p-3 text-sm text-slate-200">
                {formatCurrency(bucket.totalRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

