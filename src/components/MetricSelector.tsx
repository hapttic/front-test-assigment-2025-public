import React from 'react';
import { DollarSign, MousePointer2, Eye } from 'lucide-react';
import type { MetricType } from '../types';

interface MetricSelectorProps {
  selected: MetricType;
  onChange: (metric: MetricType) => void;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({ selected, onChange }) => {
  const buttons = [
    { key: 'revenue', label: 'Revenue', icon: DollarSign, activeColor: 'bg-[#37e6aa] text-[#114341]', activeShadow: 'shadow-sm' },
    { key: 'clicks', label: 'Clicks', icon: MousePointer2, activeColor: 'bg-[#3b82f6] text-white', activeShadow: 'shadow-sm' },
    { key: 'impressions', label: 'Impressions', icon: Eye, activeColor: 'bg-[#8b5cf6] text-white', activeShadow: 'shadow-sm' },
  ] as const;

  return (
    <div className="flex items-center bg-[#0d3533] p-1 rounded-lg border border-[#37e6aa]/30 gap-1">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        const isActive = selected === btn.key;
        
        return (
          <button
            key={btn.key}
            onClick={() => onChange(btn.key as MetricType)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              isActive
                ? `${btn.activeColor} ${btn.activeShadow}`
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        );
      })}
    </div>
  );
};