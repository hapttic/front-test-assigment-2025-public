import { useState } from 'react';
import { useAggregatedData } from './hooks/useAggregatedData';
import { useTheme } from './hooks/useTheme';
import { AggregationControls } from './components/AggregationControls';
import { StatsOverview } from './components/StatsOverview';
import { Chart } from './components/Chart';
import { DataGrid } from './components/DataGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import type { SortField } from './types';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  
  const {
    loading,
    error,
    aggregationLevel,
    setAggregationLevel,
    aggregatedData,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
  } = useAggregatedData();

  const [chartMetric, setChartMetric] = useState<'revenue' | 'clicks' | 'impressions'>('revenue');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="app-header-content">
            <h1>Campaign Analytics Dashboard</h1>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main className="app-main">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="app-header-content">
            <h1>Campaign Analytics Dashboard</h1>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main className="app-main">
          <div className="error">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <h1>Campaign Analytics Dashboard</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>
      <main className="app-main">
        <StatsOverview data={aggregatedData} />

        <div className="chart-section">
          <Chart data={aggregatedData} metric={chartMetric} />
          
          <div className="chart-controls-panel">
            <div className="control-group">
              <label>Time Period</label>
              <select
                value={aggregationLevel}
                onChange={(e) => setAggregationLevel(e.target.value as any)}
                className="control-select"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="control-group">
              <label>Chart Metric</label>
              <div className="control-buttons">
                <button
                  className={chartMetric === 'revenue' ? 'active' : ''}
                  onClick={() => setChartMetric('revenue')}
                >
                  Revenue
                </button>
                <button
                  className={chartMetric === 'clicks' ? 'active' : ''}
                  onClick={() => setChartMetric('clicks')}
                >
                  Clicks
                </button>
                <button
                  className={chartMetric === 'impressions' ? 'active' : ''}
                  onClick={() => setChartMetric('impressions')}
                >
                  Impressions
                </button>
              </div>
            </div>
          </div>
        </div>

        <DataGrid
          data={aggregatedData}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </main>
    </div>
  );
}

export default App;
