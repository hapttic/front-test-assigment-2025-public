import type { AggregationLevel } from '../lib/aggregation';

interface Props {
  level: AggregationLevel;
  onChange: (level: AggregationLevel) => void;
}

const options: { value: AggregationLevel; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function AggregationControls({ level, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Aggregation</label>
      <select
        className="border rounded-md px-2 py-1 text-sm bg-white"
        value={level}
        onChange={(e) => onChange(e.target.value as AggregationLevel)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}