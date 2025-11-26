import React from 'react';
import { 
  Instagram, 
  Linkedin, 
  Mail, 
  Search, 
  Music2, 
} from 'lucide-react';
import { Card } from '../ui/Card'; 
import { formatCurrency } from '../../utils/formatters';

interface SocialStatsProps {
  totalRevenue: number;
  totalClicks: number;
  totalImpressions: number;
}

const SocialStats: React.FC<SocialStatsProps> = ({ totalRevenue }) => {

  const statsData = [
    {
      label: 'Tik-Tok',
      value: formatCurrency(totalRevenue),
      icon: <Music2 size={20} />,
      iconWrapperClass: 'bg-black text-pink-500', 
      extraInfo: '',
    },
    {
     label: 'Instagram',
      value: formatCurrency(totalRevenue),
      icon: <Instagram size={20} />,
      iconWrapperClass: 'bg-pink-100 text-pink-600', 
      extraInfo: '',
    },
    {
      label: 'LinkedIn',
      value: formatCurrency(totalRevenue),
      icon: <Linkedin size={20} />,
      iconWrapperClass: 'bg-blue-100 text-blue-700', 
      extraInfo: '',
    },
    {
      label: 'Google',
      value: formatCurrency(totalRevenue),
      icon: <Search size={20} />,
      iconWrapperClass: 'bg-green-100 text-green-600', 
      extraInfo: '',
    },
    {
      label: 'Email',
      value: formatCurrency(totalRevenue),
      icon: <Mail size={20} />,
      iconWrapperClass: 'bg-yellow-100 text-yellow-600',
      extraInfo: '',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 my-6">
      {statsData.map((stat, index) => (
        <Card
          key={index} 
          {...stat}
        />
      ))}
    </div>
  );
};

export default SocialStats;