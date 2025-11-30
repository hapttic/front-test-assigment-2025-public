import type { MetricTypeButtonProps } from "../types/types";

function MetricTypeButton({ title, metricType, setMetricType, isActive }: MetricTypeButtonProps) {
    return (
        <button
            className={`cursor-pointer ${isActive ? "font-bold" : ""}`}
            onClick={() => setMetricType(metricType)}
        >
            {title}
        </button>
    );
}

export default MetricTypeButton;