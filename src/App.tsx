import { useState } from 'react';
import { useAggregatedData } from './hooks/useAggregatedData';
import { AggregationControls } from './components/AggregationControls';
import { Chart } from './components/Chart';
import { DataGrid } from './components/DataGrid';
import type { SortField } from './types';
import './App.css';

function App() {
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
          <h1>Campaign Analytics Dashboard</h1>
        </header>
        <main className="app-main">
          <div className="loading">Loading data...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Campaign Analytics Dashboard</h1>
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
        <h1>Campaign Analytics Dashboard</h1>
        <p className="app-subtitle">Analyze campaign performance across different time periods</p>
      </header>
      <main className="app-main">
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
