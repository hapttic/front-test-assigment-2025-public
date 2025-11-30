import { useState, useEffect } from "react";
import Header from "./components/Header";
import KPIStats from "./components/stats/KPIStats";
import TimeIntervalSelector from "./components/TimeIntervalSelector";
import CampaignPerformanceTable from "./components/campaign-table/CampaignPerformanceTable";
import SocialStats from "./components/stats/SocialStats";
import type { MetricType } from "./types"; 
import { useCampaignAnalytics } from "./hooks/useCampaignAnalytics";
import { HourlyHeatmap } from "./components/performance-table/DayHourHeatmap";
import { TimelineChart } from "./components/performance-table/TrendLineChart";
import { MetricSelector } from "./components/MetricSelector";
import { DateRangePicker } from "./components/DateRangePicker";
import { BarChart3, Share2 } from "lucide-react";

function App() {
  const { 
    loading, totals, aggregatedData, platformStats,
    aggregation, setAggregation, dateRange, setDateRange 
  } = useCampaignAnalytics();

  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [metricView, setMetricView] = useState<MetricType>('revenue');

  useEffect(() => { setTempDateRange(dateRange); }, [dateRange]);
  const handleApplyDateRange = () => { setDateRange(tempDateRange); };

  if (loading) return <div className="min-h-screen bg-[#114341] flex items-center justify-center text-white">Loading Data...</div>;

  return (
    <div className="bg-[#114341] w-full min-h-screen pb-20 font-sans">
      <Header />
      
      <main className="max-w-[1800px] mx-auto px-4 my-6 space-y-6">
        
        {/* CONTROLS SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <h1 className="text-black text-2xl font-bold uppercase bg-[#37e6aa] px-4 py-2 rounded-lg shadow-md w-full lg:w-auto text-center lg:text-left">
            Campaign Analytics
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <DateRangePicker 
               {...{start: tempDateRange.start, end: tempDateRange.end, onStartChange: (val) => setTempDateRange(prev => ({ ...prev, start: val })), onEndChange: (val) => setTempDateRange(prev => ({ ...prev, end: val })), onApply: handleApplyDateRange}}
            />
            <TimeIntervalSelector current={aggregation} onChange={setAggregation} />
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            
            {/* 1. LEFT COLUMN (KPIs + CHART) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <KPIStats 
                    totalRevenue={totals.revenue} 
                    totalClicks={totals.clicks} 
                    totalImpressions={totals.impressions} 
                    ctr={totals.ctr}
                    rpc={totals.rpc}
                    avgDailyRevenue={totals.avgDailyRevenue}
                    avgDailyClicks={totals.avgDailyClicks}
                />

                {/* CHART CONTAINER (White Background) */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg grow flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="text-[#114341]" size={20} />
                            {aggregation === 'hourly' ? 'Daily Hourly Breakdown' : 'Performance Trend'}
                        </h2>
                        <div className="bg-slate-100 p-1 rounded-lg">
                            <MetricSelector selected={metricView} onChange={setMetricView} />
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        {aggregation === 'hourly' ? (
                            <HourlyHeatmap data={aggregatedData} metricKey={metricView} />
                        ) : (
                            <TimelineChart data={aggregatedData} metricKey={metricView} aggregation={aggregation} />
                        )}
                    </div>
                </div>
            </div>

            {/* 2. RIGHT COLUMN (SIDEBAR - SOCIAL STATS) */}
            <div className="lg:col-span-1 h-full">
                <div className="bg-[#0d3533] p-3 rounded-xl border border-[#37e6aa]/20 h-full flex flex-col shadow-lg">
                    <h3 className="text-[#37e6aa] font-bold uppercase text-xs mb-3 flex items-center gap-2 pb-2 border-b border-[#37e6aa]/20">
                        <Share2 size={14} /> Platforms
                    </h3>
                    <div className="grow">
                        <SocialStats data={platformStats} totalRevenue={totals.revenue} />
                    </div>
                </div>
            </div>

        </div>

        {/* --- TABLE --- */}
        <CampaignPerformanceTable data={aggregatedData} />
      </main>
    </div>
  );
}

export default App;