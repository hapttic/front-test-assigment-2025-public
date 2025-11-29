
import { useState } from 'react';
import './App.css'
import { AggregationControls } from './components/AggregationControls'
import type { AggregationLevel } from './lib/aggregation';

function App() {
    const [level, setLevel] = useState<AggregationLevel>('hourly');
  const reaggregate = (newLevel: AggregationLevel) => {
    setLevel(newLevel);
  };

  return (
   <>
    <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Campaign Performance Dashboard</h1>
          <p className="text-sm text-gray-600">Analyze campaigns over time with dynamic aggregation.</p>
        </header>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <AggregationControls level={level} onChange={reaggregate} />
        </div>
   </>
  )
}

export default App
