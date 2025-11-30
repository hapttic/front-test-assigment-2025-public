import React from 'react';
import { Instagram, Linkedin, Mail, Search, Music2, MousePointer2, Eye, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card'; 
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { PlatformStat } from '../../hooks/useCampaignAnalytics';

interface SocialStatsProps {
  data: PlatformStat[];
  totalRevenue: number;
}

type PlatformConfig = {
  icon: React.ReactNode;
  color: string;
  bg: string;
};

const platformConfig: Record<string, PlatformConfig> = {
  'TikTok': { icon: <Music2 size={18} />, color: 'text-pink-500', bg: 'bg-black/40' },
  'Instagram': { icon: <Instagram size={18} />, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  'LinkedIn': { icon: <Linkedin size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'Google': { icon: <Search size={18} />, color: 'text-green-400', bg: 'bg-green-500/20' },
  'Email': { icon: <Mail size={18} />, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
};

const SocialStats: React.FC<SocialStatsProps> = ({ data, totalRevenue }) => {
  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1">
      {data.map((stat) => {
        const config = platformConfig[stat.platform] || { icon: <Search size={18} />, color: 'text-gray-400', bg: 'bg-gray-100/10' };
        const percent = totalRevenue > 0 ? Math.round((stat.revenue / totalRevenue) * 100) : 0;

        return (
          <Card
            key={stat.platform}
            variant="compact"
            label={stat.platform}
            icon={config.icon}
            iconWrapperClass={`${config.bg} ${config.color}`}
            className="bg-white/5 border-white/5 hover:bg-white/10 transition-all group"
            
            value={
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <DollarSign size={12} /> Rev
                    </span>
                    <span className="text-base font-bold text-emerald-400">
                        {formatCurrency(stat.revenue)}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                           <MousePointer2 size={10} /> Clicks
                        </span>
                        <span className="text-xs font-semibold text-blue-300">
                            {formatNumber(stat.clicks)}
                        </span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-end gap-1">
                           <Eye size={10} /> Impr
                        </span>
                        <span className="text-xs font-semibold text-violet-300">
                            {formatNumber(stat.impressions)}
                        </span>
                    </div>
                </div>
              </div>
            }
            
            extraInfo={
              <span className="text-[10px] font-bold bg-[#37e6aa]/10 text-[#37e6aa] px-2 py-0.5 rounded-full border border-[#37e6aa]/20">
                {percent}%
              </span>
            }
          />
        );
      })}
      
      <div className="grow"></div>
    </div>
  );
};

export default SocialStats;