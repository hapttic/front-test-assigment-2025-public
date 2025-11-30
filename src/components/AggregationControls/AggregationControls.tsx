import React from "react";
import "./AggregationControls.scss";

type AggregationType = "Hourly" | "Daily" | "Weekly" | "Monthly";

interface AggregationControlsProps {
  selected: AggregationType;
  onSelect: (type: AggregationType) => void;
}

const AggregationControls: React.FC<AggregationControlsProps> = ({
  selected,
  onSelect,
}) => {
  const options: AggregationType[] = ["Hourly", "Daily", "Weekly", "Monthly"];

  return (
    <div className="aggregation-controls">
      <span>Aggregation:</span>
      <div className="button-group">
        {options.map((option) => (
          <button
            key={option}
            className={`control-btn ${selected === option ? "active" : ""}`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AggregationControls;
