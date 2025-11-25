import type {
  AggregatedData,
  AggregationPeriod,
  sortBy,
} from "../../../lib/types";
import { formatDate } from "../../../lib/utils";
import useSort from "../../../lib/hooks/useSort";
import SortIcon from "./SortIcon";

interface props {
  data: AggregatedData[];
  period: AggregationPeriod;
}

interface TableHeading {
  label: string;
  field: sortBy;
}

const tableHeadings: TableHeading[] = [
  { label: "Date", field: "date" },
  { label: "Campaigns", field: "campaigns" },
  { label: "Impressions", field: "impressions" },
  { label: "Clicks", field: "clicks" },
  { label: "Revenue", field: "revenue" },
];

export default function DataGrid({ data, period }: props) {
  const btnClass = `flex items-center text-sm font-semibold text-foreground cursor-pointer  hover:text-primary transition-colors`;
  const thClass = "px-6 py-4 text-left";
  const tdClass = `px-6 py-4 text-sm text-foreground`;

  function tableHeadButtonClass(field: sortBy) {
    if (field === "impressions" || field === "clicks" || field === "revenue")
      return btnClass + " ml-auto" + " " + activeSortClass(field);

    return btnClass + " " + activeSortClass(field);
  }

  const {
    sortedData,
    handleSort,
    activeSortClass,
    formatValue,
    sortBy,
    sortOrder,
  } = useSort(data);

  return (
    <div className="rounded-xl border border-border bg-card max-h-[500px] overflow-y-scroll">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {tableHeadings.map((heading) => (
                <th key={heading.field} className={thClass}>
                  <button
                    onClick={() => handleSort(heading.field)}
                    className={tableHeadButtonClass(heading.field)}
                  >
                    {heading.label}
                    <SortIcon
                      field={heading.field}
                      sortField={sortBy}
                      sortDirection={sortOrder}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className={tdClass}>{formatDate(row.timestamp, period)}</td>
                <td className={tdClass}>{row.campaignsActive}</td>
                <td className={tdClass + " text-right"}>
                  {formatValue(row.totalImpressions, "Total Impressions")}
                </td>
                <td className={tdClass + " text-right "}>
                  {formatValue(row.totalClicks, "Total Clicks")}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-chart-3">
                  {formatValue(row.totalRevenue, "Total Revenue")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
