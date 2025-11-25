import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CampaignMetrics } from '../../types';

interface SortConfig {
  key: keyof CampaignMetrics;
  dir: 'asc' | 'desc';
}

interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: keyof CampaignMetrics) => void;
}

const columns = [
  { 
    label: 'Date', 
    key: 'timestamp', 
    className: '' 
  }, 
  { 
    label: 'Active Campaigns', 
    key: 'campaignId', 
    className: 'hidden lg:table-cell' 
  },
  { 
    label: 'Impressions', 
    key: 'impressions', 
    className: 'hidden md:table-cell' 
  },
  { 
    label: 'Clicks', 
    key: 'clicks', 
    className: 'hidden sm:table-cell' 
  },
  { 
    label: 'Revenue', 
    key: 'revenue', 
    className: ''
  },
] as const;

export const TableHeader: React.FC<TableHeaderProps> = ({ sortConfig, onSort }) => {
  return (
    <thead className="bg-white text-slate-700 font-medium border-b border-slate-200">
      <tr>
        {columns.map((col) => {
          const isActive = sortConfig.key === col.key;
          
          return (
            <th 
              key={col.key}
              className={`
                px-6 py-4 cursor-pointer hover:bg-slate-200 transition-colors select-none text-left group
                ${col.className} 
              `}
              onClick={() => onSort(col.key as keyof CampaignMetrics)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                <span className="w-4 flex justify-center">
                  {isActive ? (
                    sortConfig.dir === 'asc' 
                      ? <ChevronUp size={14} className="text-black" />
                      : <ChevronDown size={14} className="text-black" />
                  ) : (
                    <ChevronDown size={14} className="opacity-0 group-hover:opacity-30 transition-opacity" /> 
                  )}
                </span>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};