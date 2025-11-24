import React from 'react';



interface CardProps {
  label: string;             
  value: string | number;    
  icon: React.ReactNode;        
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  label, 
  value, 
  icon, 
  className = '' 
}) => {
  

  return (
    <div className={`
      ${className}
    `}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-lg
          transition-colors duration-300
        `}>
          <div className="w-5 h-5 flex items-center justify-center">
             {icon}
          </div>
        </div>
        
        <span className="text-gray-500 font-medium text-sm tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-1">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};