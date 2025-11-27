import React from 'react';
import type { AggregatedPoint } from '../../hooks/useCampaignAnalytics';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface TableRowProps {
  data: AggregatedPoint;
}

export const TableRow: React.FC<TableRowProps> = ({ data }) => {
  
  const dateObj = new Date(data.timestamp);

  const dateTimeString = dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const yearString = dateObj.getFullYear();

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-none group">
      
      {/* Date Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
            <span className="font-medium text-slate-900">
                {dateTimeString}
            </span>
            <span className="text-xs text-slate-400 font-normal mt-0.5">
                {yearString}
            </span>
        </div>
      </td>

      {/* Active Campaigns */}
      <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {data.activeCampaigns} Active
        </span>
      </td>

      {/* Impressions */}
      <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
        {formatNumber(data.impressions)}
      </td>

      {/* Clicks */}
      <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">
        {formatNumber(data.clicks)}
      </td>

      {/* Revenue */}
      <td className="px-6 py-4 text-emerald-600 font-medium">
        {formatCurrency(data.revenue)}
      </td>
    </tr>
  );
};