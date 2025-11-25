import React from 'react';

interface CardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconWrapperClass?: string; 
  extraInfo?: React.ReactNode; 
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  label, 
  value, 
  icon, 
  iconWrapperClass = 'bg-slate-100 text-slate-600', 
  extraInfo,
  className = '' 
}) => {
  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${iconWrapperClass}`}>
            {icon}
        </div>
        
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>
      </div>

      <div>
        <div className="text-3xl font-bold text-slate-900">
          {value}
        </div>
        {extraInfo && (
          <div className="mt-1">
            {extraInfo}
          </div>
        )}
      </div>
    </div>
  );
};