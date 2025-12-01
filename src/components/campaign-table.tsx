import type { Metric } from "@/lib/_utils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Pagination } from "./ui/pagination";

const COLUMNS = [
  "Date",
  "Campaigns Active",
  "Total Impressions",
  "Total Clicks",
  "Total Revenue",
];

type Props = {
  data: Metric[];
};

type TableRow = {
  date: string;
  campaignsActive: string;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
};

type SortColumn = "date" | "revenue" | null;
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

export const CampaignTable = ({ data }: Props) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const tableRows: TableRow[] = useMemo(() => {
    const mapped = data.map((item) => ({
      date: item.timestamp,
      campaignsActive: item.campaignId,
      totalImpressions: item.impressions,
      totalClicks: item.clicks,
      totalRevenue: item.revenue,
    }));

    if (!sortColumn) {
      return mapped.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    const sorted = [...mapped].sort((a, b) => {
      let comparison = 0;

      if (sortColumn === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortColumn === "revenue") {
        comparison = a.totalRevenue - b.totalRevenue;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(tableRows.length / ITEMS_PER_PAGE);
  const currentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    return Math.min(Math.max(1, page), totalPages);
  }, [page, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRows = tableRows.slice(startIndex, endIndex);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, "MMM dd, yyyy");
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="w-full mt-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {COLUMNS.map((column, index) => {
                const isSortable =
                  column === "Date" || column === "Total Revenue";
                const columnKey =
                  column === "Date"
                    ? "date"
                    : column === "Total Revenue"
                    ? "revenue"
                    : null;
                const isSorted = sortColumn === columnKey;

                return (
                  <th
                    key={column}
                    className={cn(
                      "px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider",
                      {
                        "text-left": index === 0,
                        "text-right": index === COLUMNS.length - 1,
                        "cursor-pointer hover:bg-gray-100 select-none":
                          isSortable,
                      }
                    )}
                    onClick={() => isSortable && handleSort(columnKey)}
                  >
                    <div
                      className={cn("flex items-center gap-2", {
                        "justify-start": index === 0,
                        "justify-center":
                          index > 0 && index < COLUMNS.length - 1,
                        "justify-end": index === COLUMNS.length - 1,
                      })}
                    >
                      <span>{column}</span>
                      {isSortable && (
                        <span className="text-gray-500">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )
                          ) : (
                            <svg
                              className="w-4 h-4 opacity-30"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows.length <= 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr
                  key={row.date + row.campaignsActive + index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(row.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {row.campaignsActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {formatNumber(row.totalImpressions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {formatNumber(row.totalClicks)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(row.totalRevenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {tableRows.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={tableRows.length}
        />
      )}
    </div>
  );
};
