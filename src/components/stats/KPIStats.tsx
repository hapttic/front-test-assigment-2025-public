import React from 'react';
import { DollarSign, MousePointer2, Eye, Percent, TrendingUp, Calendar, MousePointerClick } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface KPIStatsProps {
  totalRevenue: number; totalClicks: number; totalImpressions: number;
  ctr?: number; rpc?: number; avgDailyRevenue?: number; avgDailyClicks?: number;
}

const KPIStats: React.FC<KPIStatsProps> = ({ 
    totalRevenue, totalClicks, totalImpressions, ctr = 0, rpc = 0, avgDailyRevenue = 0, avgDailyClicks = 0
}) => {
  const cards = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <DollarSign size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Clicks', value: formatNumber(totalClicks), icon: <MousePointer2 size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Impressions', value: formatNumber(totalImpressions), icon: <Eye size={20} />, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'CTR (Click Rate)', value: `${ctr}%`, icon: <Percent size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Avg. Daily Rev.', value: formatCurrency(avgDailyRevenue), icon: <Calendar size={20} />, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Avg. Daily Clicks', value: formatNumber(avgDailyClicks), icon: <MousePointerClick size={20} />, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'RPC (Rev/Click)', value: formatCurrency(rpc), icon: <TrendingUp size={20} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} variant="standard" label={card.label} value={card.value} icon={card.icon} iconWrapperClass={`${card.bg} ${card.color}`} className="border border-slate-100 shadow-sm" />
      ))}
    </div>
  );
};
export default KPIStats;