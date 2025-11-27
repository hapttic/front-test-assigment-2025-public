import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { AggregatedPoint } from '../../hooks/useCampaignAnalytics';

interface SortConfig {
  key: keyof AggregatedPoint;
  dir: 'asc' | 'desc';
}

interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: keyof AggregatedPoint) => void;
}

const columns = [
  { 
    label: 'Date', 
    key: 'timestamp', 
    className: '',
    sortable: true 
  }, 
  { 
    label: 'Active Campaigns', 
    key: 'activeCampaigns', 
    className: 'hidden lg:table-cell',
    sortable: false 
  },
  { 
    label: 'Impressions', 
    key: 'impressions', 
    className: 'hidden md:table-cell',
    sortable: true
  },
  { 
    label: 'Clicks', 
    key: 'clicks', 
    className: 'hidden sm:table-cell',
    sortable: true
  },
  { 
    label: 'Revenue', 
    key: 'revenue', 
    className: '',
    sortable: true
  },
] as const;

export const TableHeader: React.FC<TableHeaderProps> = ({ sortConfig, onSort }) => {
  return (
    <thead className="bg-white text-slate-700 font-medium border-b border-slate-200">
      <tr>
        {columns.map((col) => {
          const colKey = col.key as keyof AggregatedPoint;
          const isActive = sortConfig.key === colKey;
          const isSortable = col.sortable !== false; 
          
          return (
            <th 
              key={col.key}
              className={`
                px-6 py-4 select-none text-left group
                ${col.className} 
                ${isSortable ? 'cursor-pointer hover:bg-slate-50 transition-colors' : 'cursor-default'}
              `}
              onClick={() => isSortable && onSort(colKey)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                
                {isSortable && (
                  <span className="w-4 flex justify-center">
                    {isActive ? (
                      sortConfig.dir === 'asc' 
                        ? <ChevronUp size={14} className="text-emerald-600" />
                        : <ChevronDown size={14} className="text-emerald-600" />
                    ) : (
                      <ChevronDown size={14} className="opacity-0 group-hover:opacity-30 transition-opacity text-slate-400" /> 
                    )}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};