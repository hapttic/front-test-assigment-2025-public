import { useState, useEffect } from "react";
import Header from "./components/Header";
import KPIStats from "./components/stats/KPIStats";
import TimeIntervalSelector from "./components/TimeIntervalSelector";
import CampaignPerformanceTable from "./components/campaign-table/CampaignPerformanceTable";
import SocialStats from "./components/stats/SocialStats";
import type { TimeInterval } from "./types"; 
import { useCampaignAnalytics } from "./hooks/useCampaignAnalytics";
import { DollarSign, Eye, MousePointer2, RefreshCw } from "lucide-react";
import { HourlyHeatmap } from "./components/performance-table/DayHourHeatmap";
import { TimelineChart } from "./components/performance-table/TrendLineChart";

function App() {
  const { 
    loading, 
    totals, 
    aggregatedData, 
    aggregation, 
    setAggregation, 
    dateRange, 
    setDateRange 
  } = useCampaignAnalytics();

  const [tempDateRange, setTempDateRange] = useState(dateRange);

  useEffect(() => {
    setTempDateRange(dateRange);
  }, [dateRange]);

  const [metricView, setMetricView] = useState<'revenue' | 'clicks' | 'impressions'>('revenue');

  const handleApplyDateRange = () => {
    setDateRange(tempDateRange);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#114341] flex items-center justify-center text-white">Loading Data...</div>;
  }

  return (
    <div className="bg-[#114341] w-full min-h-screen pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between items-center gap-4 px-4 my-6">
        
        {/* Title */}
        <h1 className="text-black text-2xl font-bold uppercase bg-[#37e6aa] px-4 py-2 rounded-lg shadow-md">
          Campaign Analytics
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Date Picker Section */}
          <div className="flex items-center gap-2 bg-[#0d3533] p-1.5 rounded-lg border border-[#37e6aa]/30">
            <input 
              type="date" 
              value={tempDateRange.start}
              onChange={(e) => setTempDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-transparent text-white text-sm focus:outline-none px-2 cursor-pointer font-mono"
            />
            <span className="text-[#37e6aa]">-</span>
            <input 
              type="date" 
              value={tempDateRange.end}
              onChange={(e) => setTempDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-transparent text-white text-sm focus:outline-none px-2 cursor-pointer font-mono"
            />
            <button 
              onClick={handleApplyDateRange}
              className="p-1.5 bg-[#37e6aa] text-[#114341] rounded hover:bg-[#2fc490] transition-colors ml-2"
            >
              <RefreshCw size={16} /> 
            </button>
          </div>

          {/* Metric Selectors */}
          <div className="flex items-center bg-[#0d3533] p-1 rounded-lg border border-[#37e6aa]/30 gap-1">
            <button
              onClick={() => setMetricView("revenue")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                metricView === "revenue"
                  ? "bg-[#37e6aa] text-[#114341] shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <DollarSign size={16} />
              <span className="hidden sm:inline">Revenue</span>
            </button>

            <button
              onClick={() => setMetricView("clicks")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                metricView === "clicks"
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <MousePointer2 size={16} />
              <span className="hidden sm:inline">Clicks</span>
            </button>

            <button
              onClick={() => setMetricView("impressions")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                metricView === "impressions"
                  ? "bg-[#8b5cf6] text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Impressions</span>
            </button>
</div>

          <TimeIntervalSelector 
            current={aggregation} 
            onChange={(val) => setAggregation(val as TimeInterval)} 
          />
        </div>
      </div>

      <KPIStats 
        totalRevenue={totals.revenue} 
        totalClicks={totals.clicks} 
        totalImpressions={totals.impressions} 
      />
      <SocialStats 
        totalRevenue={totals.revenue} 
        totalClicks={totals.clicks} 
        totalImpressions={totals.impressions} 
      />

    {aggregation === 'hourly' ? (
      <HourlyHeatmap data={aggregatedData} metricKey={metricView} />
      ) : (
      <TimelineChart data={aggregatedData} metricKey={metricView} aggregation={aggregation} />
      )}

      <CampaignPerformanceTable data={aggregatedData} />
    </div>
  );
}

export default App;