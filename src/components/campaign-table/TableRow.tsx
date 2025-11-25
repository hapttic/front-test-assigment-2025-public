import React from 'react';


export const TableRow: React.FC = () => {
  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-none">
      <td className="px-6 py-4 font-medium text-slate-900">1</td>
      <td className="px-6 py-4 text-slate-600">2</td>
      <td className="px-6 py-4 text-slate-600">3</td>
      <td className="px-6 py-4 text-slate-600">4</td>
      <td className="px-6 py-4 text-emerald-600 font-medium">5</td>
    </tr>
  );
};