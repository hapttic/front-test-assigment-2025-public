import type { AggregationLevel } from '../types';
import './AggregationControls.css';

interface AggregationControlsProps {
  value: AggregationLevel;
  onChange: (level: AggregationLevel) => void;
}

export function AggregationControls({ value, onChange }: AggregationControlsProps) {
  const levels: AggregationLevel[] = ['hourly', 'daily', 'weekly', 'monthly'];

  return (
    <div className="aggregation-controls">
      <label htmlFor="aggregation-select">Time Period:</label>
      <select
        id="aggregation-select"
        value={value}
        onChange={(e) => onChange(e.target.value as AggregationLevel)}
        className="aggregation-select"
      >
        {levels.map((level) => (
          <option key={level} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

