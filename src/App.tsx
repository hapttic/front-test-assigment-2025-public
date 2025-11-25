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
          <p className="app-subtitle">Analyze campaign performance across different time periods</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>
      <main className="app-main">
        <StatsOverview data={aggregatedData} />
        
        <AggregationControls
          value={aggregationLevel}
          onChange={setAggregationLevel}
        />

        <div className="metric-selector">
          <label>Chart Metric:</label>
          <div className="metric-buttons">
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

        <Chart data={aggregatedData} metric={chartMetric} />

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
