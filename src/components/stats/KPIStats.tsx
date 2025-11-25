import React from 'react';
import { DollarSign, MousePointer2, Activity } from 'lucide-react';
import { Card } from '../ui/Card'; 
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface KPIStatsProps {
  totalRevenue: number;
  totalClicks: number;
  totalImpressions: number;
}

const KPIStats: React.FC<KPIStatsProps> = ({ totalRevenue, totalClicks, totalImpressions }) => {

  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const statsData = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: <DollarSign size={20} />,
      iconWrapperClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Total Clicks',
      value: formatNumber(totalClicks),
      icon: <MousePointer2 size={20} />,
      iconWrapperClass: 'bg-blue-100 text-blue-600',
      extraInfo: <div className="text-xs text-slate-400 mt-1">Avg CTR: {ctr}%</div>,
    },
    {
      label: 'Total Impressions',
      value: formatNumber(totalImpressions),
      icon: <Activity size={20} />,
      iconWrapperClass: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <Card
          key={index} 
          {...stat}
        />
      ))}
    </div>
  );
};

export default KPIStats;