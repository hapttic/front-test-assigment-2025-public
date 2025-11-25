import { useMemo, useState } from "react";
import type { AggregatedRow } from "../types";

export default function DataGrid({ rows }: { rows: AggregatedRow[] }) {
  const [sortKey, setSortKey] = useState<"start" | "revenue">("start");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const v =
        sortKey === "start"
          ? a.start.localeCompare(b.start)
          : a.revenue - b.revenue;
      return dir === "asc" ? v : -v;
    });
    return copy;
  }, [rows, sortKey, dir]);

  const toggle = (key: "start" | "revenue") => {
    if (sortKey === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDir("desc");
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="p-2 text-left cursor-pointer"
              onClick={() => toggle("start")}
            >
              Date
            </th>
            <th className="p-2 text-right">Campaigns Active</th>
            <th className="p-2 text-right">Impressions</th>
            <th className="p-2 text-right">Clicks</th>
            <th
              className="p-2 text-right cursor-pointer"
              onClick={() => toggle("revenue")}
            >
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.key} className="border-t">
              <td className="p-2">{r.label}</td>
              <td className="p-2 text-right">{r.campaignsActive}</td>
              <td className="p-2 text-right">
                {r.impressions.toLocaleString()}
              </td>
              <td className="p-2 text-right">{r.clicks.toLocaleString()}</td>
              <td className="p-2 text-right">${r.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
