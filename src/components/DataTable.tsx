import type { AggregatedSlot } from "../types";

export default function DataTable({ rows }: { rows: AggregatedSlot[] }) {
  return (
    <div className="border border-gray-300 rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-auto max-h-[500px]">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Campaigns Active</th>
              <th className="p-2 text-left">Impressions</th>
              <th className="p-2 text-left">Clicks</th>
              <th className="p-2 text-left">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-100">
                <td className="p-2">{r.start}</td>
                <td className="p-2">{r.campaignsActive}</td>
                <td className="p-2">{r.impressions}</td>
                <td className="p-2">{r.clicks}</td>
                <td className="p-2">${r.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
