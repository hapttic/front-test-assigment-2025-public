export default function Skeleton() {
  return (
    <div className="w-full space-y-10">
      {/* button Skeleton */}
      <div className="flex">
        <div className="ml-auto w-32 h-10 rounded-md bg-gray-200 animate-pulse" />
      </div>

      {/* Chart Skeleton */}
      <div className="w-full p-4 shadow-md rounded my-wrapper h-[500px] bg-gray-200 animate-pulse" />

      {/* Table Skeleton */}
      <div className="border border-gray-300 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b">
                <th className="p-2 text-left"> </th>
                <th className="p-2 text-left"> </th>
                <th className="p-2 text-left"> </th>
                <th className="p-2 text-left"> </th>
                <th className="p-2 text-left"> </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 h-6 bg-gray-200 rounded animate-pulse"></td>
                  <td className="p-2 h-6 bg-gray-200 rounded animate-pulse"></td>
                  <td className="p-2 h-6 bg-gray-200 rounded animate-pulse"></td>
                  <td className="p-2 h-6 bg-gray-200 rounded animate-pulse"></td>
                  <td className="p-2 h-6 bg-gray-200 rounded animate-pulse"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
