import { useState, useMemo } from 'react';
import type { AggregationLevel, ChartMetric } from './types';
import { aggregateData } from './utils/aggregation';
import { useLoadData } from './hooks/useLoadData';
import { DataGrid } from './components/DataGrid';
import { TimelineChart } from './components/TimelineChart';

function App() {
  // State management for user controls
  const [aggregationLevel, setAggregationLevel] = useState<AggregationLevel>('Daily');
  const [chartMetric, setChartMetric] = useState<ChartMetric>('Revenue');

  /**
   * Load raw hourly data from data.json
   * This hook fetches data once on component mount
   */
  const { data: hourlyData, isLoading, error } = useLoadData();

  /**
   * useMemo: Aggregate data based on selected level
   * This runs ONLY when aggregationLevel or hourlyData changes
   * 
   * Performance optimization: Prevents expensive recalculation on every render
   */
  const aggregatedData = useMemo(() => {
    if (hourlyData.length === 0) {
      return [];
    }
    return aggregateData(hourlyData, aggregationLevel);
  }, [hourlyData, aggregationLevel]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Hapttic Campaign Analytics Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-semibold mb-2">Error Loading Data</p>
              <p className="text-red-600 text-sm">{error.message}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading campaign data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls Section */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center">
                {/* Aggregation Level Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Time Period:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['Hourly', 'Daily', 'Weekly', 'Monthly'] as AggregationLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setAggregationLevel(level)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                          aggregationLevel === level
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Data Points</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{aggregatedData.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Aggregation Level</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{aggregationLevel}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Chart Showing</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{chartMetric}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Raw Data Points</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{hourlyData.length}</p>
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Timeline Chart
              </h2>
              {/* Chart Metric Controls */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  {(['Clicks', 'Revenue'] as ChartMetric[]).map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setChartMetric(metric)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        chartMetric === metric
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
              <TimelineChart
                data={aggregatedData}
                aggregationLevel={aggregationLevel}
                metric={chartMetric}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Data Grid
              </h2>
              <DataGrid data={aggregatedData} aggregationLevel={aggregationLevel} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
