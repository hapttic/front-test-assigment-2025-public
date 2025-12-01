import type { MetricType } from "../types";

interface MetricToggleProps {
  metric: MetricType;
  onMetricChange: (metric: MetricType) => void;
}

const MetricToggle: React.FC<MetricToggleProps> = ({ metric, onMetricChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Metric:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onMetricChange("clicks")}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            metric === "clicks"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Clicks
        </button>
        <button
          onClick={() => onMetricChange("revenue")}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            metric === "revenue"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Revenue
        </button>
      </div>
    </div>
  );
};

export default MetricToggle;
