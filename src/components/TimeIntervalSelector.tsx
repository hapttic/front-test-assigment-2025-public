import React from 'react';
import type { TimeInterval } from '../types';
import { Button } from './ui/Button';


interface TimeIntervalSelectorProps {
  current: TimeInterval;
  onChange: (interval: TimeInterval) => void;
}


const TimeIntervalSelector: React.FC<TimeIntervalSelectorProps> = ({ current, onChange }) => {

  const intervals: TimeInterval[] = ['hourly', 'daily', 'weekly', 'monthly'];
  
  return (
    <div className="inline-flex bg-[#37e6aa] p-1 rounded-lg">
      {intervals.map((interval) => (
        <Button
          key={interval}
          onClick={() => onChange(interval)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all capitalize
            ${current === interval 
              ? 'bg-white text-black' 
              : 'text-slate-700 hover:text-slate-800 hover:bg-slate-200/50'}
          `}
        >
          {interval}
        </Button>
      ))}
    </div>
  );
};

export default TimeIntervalSelector;