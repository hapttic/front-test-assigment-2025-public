import React from 'react';
import { RefreshCw } from 'lucide-react';

interface DateRangePickerProps {
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onApply: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  start, end, onStartChange, onEndChange, onApply 
}) => {
  return (
    <div className="flex items-center gap-2 bg-[#0d3533] p-1.5 rounded-lg border border-[#37e6aa]/30">
      <input 
        type="date" 
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="bg-transparent text-white text-sm focus:outline-none px-2 cursor-pointer font-mono"
      />
      <span className="text-[#37e6aa]">-</span>
      <input 
        type="date" 
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="bg-transparent text-white text-sm focus:outline-none px-2 cursor-pointer font-mono"
      />
      <button 
        onClick={onApply}
        className="p-1.5 bg-[#37e6aa] text-[#114341] rounded hover:bg-[#2fc490] transition-colors ml-2"
        title="Apply Date Range"
      >
        <RefreshCw size={16} /> 
      </button>
    </div>
  );
};