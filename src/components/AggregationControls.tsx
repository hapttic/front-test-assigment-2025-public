import type { AggregationLevel } from "../types";

interface AggregationControlsProps {
  aggregation: AggregationLevel;
  onAggregationChange: (level: AggregationLevel) => void;
}

const AggregationControls = ({ aggregation, onAggregationChange }: AggregationControlsProps) => {
  const aggregationOptions: { value: AggregationLevel; label: string }[] = [
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div className="flex items-center gap-3 mb-6">
      <label htmlFor="aggregation-select" className="text-sm font-semibold text-gray-700">
        View by:
      </label>
      <select
        id="aggregation-select"
        value={aggregation}
        onChange={(e) => onAggregationChange(e.target.value as AggregationLevel)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {aggregationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AggregationControls;
