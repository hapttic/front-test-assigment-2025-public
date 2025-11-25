import type { AggregatedData, AggregationPeriod } from "../../../lib/types";
import { formatDate } from "../../../lib/utils";

interface props {
  data: AggregatedData[];
  period: AggregationPeriod;
}
export default function DataGrid({ data, period }: props) {
  // const data = [
  //   {
  //     timestamp: "Wed Nov 25 2025",
  //     campaign: "c1",
  //     campaignsActive: 5,
  //     totalImpressions: 1000,
  //     totalClicks: 50,
  //     totalRevenue: 5000,
  //   },
  //   {
  //     timestamp: "Thu Nov 26 2025",
  //     campaign: "c2",
  //     campaignsActive: 5,
  //     totalImpressions: 800,
  //     totalClicks: 40,
  //     totalRevenue: 4000,
  //   },
  // ];

  const btnClass = `flex items-center text-sm font-semibold text-foreground cursor-pointer  hover:text-primary transition-colors`;
  const thClass = "px-6 py-4 text-left";
  const tdClass = `px-6 py-4 text-sm text-foreground`;

  function formatValue(value: number, label: string) {
    if (label === "Total Revenue") {
      return `$ ${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return value.toLocaleString();
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className={thClass}>
                <button className={btnClass}>Date</button>
              </th>
              <th className={thClass}>
                <button className={btnClass}>Campaigns Active</button>
              </th>
              <th className={thClass}>
                <button className={"ml-auto " + btnClass}>
                  Total Impressions
                </button>
              </th>
              <th className={thClass}>
                <button className={"ml-auto " + btnClass}>Total Clicks</button>
              </th>
              <th className={thClass}>
                <button className={"ml-auto " + btnClass}>Total Revenue</button>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
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
