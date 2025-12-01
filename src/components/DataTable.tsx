import type { AggregatedSlot } from "../types";

export default function DataTable({ rows }: { rows: AggregatedSlot[] }) {
  return (
    <div className=" rounded-2xl overflow-hidden shadow-md">
      {/* className="overflow-x-auto max-h-[500px] border border-gray-300 rounded-2xl" */}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-2">Date</th>
            <th className="p-2">Campaigns Active</th>
            <th className="p-2">Impressions</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Revenue</th>
          </tr>
        </thead>

        {/* <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b hover:bg-gray-100">
              <td className="p-2">{r.start.toISOString()}</td>
              <td className="p-2">{r.campaignsActive}</td>
              <td className="p-2">{r.impressions}</td>
              <td className="p-2">{r.clicks}</td>
              <td className="p-2">${r.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody> */}
      </table>

      <div className="max-h-[500px] overflow-auto">
        <table className="min-w-full text-sm">
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
