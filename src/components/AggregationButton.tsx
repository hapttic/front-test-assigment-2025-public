import type { AggregationButtonProps } from "../types/types";

function AggregationButton({ title, aggregationType, setAggregationType, isActive }: AggregationButtonProps) {
    return (
        <button className={`cursor-pointer ${isActive ? "font-bold" : ""}`}
            onClick={() => setAggregationType(aggregationType)}>{title}</button>
    );
}

export default AggregationButton;