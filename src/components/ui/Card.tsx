import React from 'react';

interface CardProps {
  label: string;
  value: React.ReactNode; 
  icon: React.ReactNode;
  iconWrapperClass?: string; 
  extraInfo?: React.ReactNode; 
  className?: string;
  variant?: 'standard' | 'compact';
}

export const Card: React.FC<CardProps> = ({ 
  label, value, icon, iconWrapperClass = 'bg-slate-100 text-slate-600', 
  extraInfo, className = '', variant = 'standard' 
}) => {
  
  // COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-lg border flex flex-col gap-3 transition-colors ${className}`}>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md shrink-0 ${iconWrapperClass}`}>
                    {icon}
                </div>
                <span className="text-sm text-slate-200 font-semibold truncate">{label}</span>
            </div>
            {/* Percent Badge  */}
            {extraInfo && <div className="shrink-0">{extraInfo}</div>}
        </div>

        <div className="w-full">
            {value}
        </div>
      </div>
    );
  }

  // STANDARD VARIANT 
  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${iconWrapperClass}`}>{icon}</div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {extraInfo && <div className="mt-1">{extraInfo}</div>}
      </div>
    </div>
  );
};