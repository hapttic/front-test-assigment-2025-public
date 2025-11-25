import { useMemo } from 'react';
import type { AggregatedDataPoint } from '../types';
import { StatsCard } from './StatsCard';
import './StatsOverview.css';

interface StatsOverviewProps {
  data: AggregatedDataPoint[];
}

export function StatsOverview({ data }: StatsOverviewProps) {
  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        totalRevenue: 0,
        totalClicks: 0,
        totalImpressions: 0,
        ctr: 0,
        avgRevenuePerClick: 0,
        totalCampaigns: 0,
        revenueTrend: 0,
        clicksTrend: 0,
        impressionsTrend: 0,
      };
    }

    // Calculate totals
    const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);
    const totalClicks = data.reduce((sum, d) => sum + d.totalClicks, 0);
    const totalImpressions = data.reduce((sum, d) => sum + d.totalImpressions, 0);
    
    // CTR (Click-Through Rate)
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    
    // Average Revenue per Click
    const avgRevenuePerClick = totalClicks > 0 ? totalRevenue / totalClicks : 0;
    
    // Total unique campaigns
    const allCampaigns = new Set<string>();
    data.forEach(d => {
      d.campaignsActive.forEach(c => allCampaigns.add(c));
    });
    const totalCampaigns = allCampaigns.size;

    // Calculate trends (compare first half vs second half)
    if (data.length >= 4) {
      const midpoint = Math.floor(data.length / 2);
      const firstHalf = data.slice(0, midpoint);
      const secondHalf = data.slice(midpoint);

      const firstRevenue = firstHalf.reduce((sum, d) => sum + d.totalRevenue, 0);
      const secondRevenue = secondHalf.reduce((sum, d) => sum + d.totalRevenue, 0);
      const revenueTrend = firstRevenue > 0 ? ((secondRevenue - firstRevenue) / firstRevenue) * 100 : 0;

      const firstClicks = firstHalf.reduce((sum, d) => sum + d.totalClicks, 0);
      const secondClicks = secondHalf.reduce((sum, d) => sum + d.totalClicks, 0);
      const clicksTrend = firstClicks > 0 ? ((secondClicks - firstClicks) / firstClicks) * 100 : 0;

      const firstImpressions = firstHalf.reduce((sum, d) => sum + d.totalImpressions, 0);
      const secondImpressions = secondHalf.reduce((sum, d) => sum + d.totalImpressions, 0);
      const impressionsTrend = firstImpressions > 0 ? ((secondImpressions - firstImpressions) / firstImpressions) * 100 : 0;

      return {
        totalRevenue,
        totalClicks,
        totalImpressions,
        ctr,
        avgRevenuePerClick,
        totalCampaigns,
        revenueTrend,
        clicksTrend,
        impressionsTrend,
      };
    }

    return {
      totalRevenue,
      totalClicks,
      totalImpressions,
      ctr,
      avgRevenuePerClick,
      totalCampaigns,
      revenueTrend: 0,
      clicksTrend: 0,
      impressionsTrend: 0,
    };
  }, [data]);

  return (
    <div className="stats-overview">
      <StatsCard
        title="Total Revenue"
        value={stats.totalRevenue}
        format="currency"
        trend={stats.revenueTrend}
        icon="revenue"
        delay={0}
      />
      <StatsCard
        title="Total Clicks"
        value={stats.totalClicks}
        format="number"
        trend={stats.clicksTrend}
        icon="clicks"
        delay={100}
      />
      <StatsCard
        title="Total Impressions"
        value={stats.totalImpressions}
        format="number"
        trend={stats.impressionsTrend}
        icon="impressions"
        delay={200}
      />
      <StatsCard
        title="Click-Through Rate"
        value={stats.ctr}
        format="percentage"
        icon="rate"
        delay={300}
      />
      <StatsCard
        title="Avg Revenue/Click"
        value={stats.avgRevenuePerClick}
        format="currency"
        icon="revenue"
        delay={400}
      />
      <StatsCard
        title="Active Campaigns"
        value={stats.totalCampaigns}
        format="number"
        icon="campaign"
        delay={500}
      />
    </div>
  );
}

