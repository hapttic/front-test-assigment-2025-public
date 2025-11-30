import type { AggregationButtonProps } from "../types/types";

function AggregationButton({ title, aggregationType, setAggregationType, isActive }: AggregationButtonProps) {
    return (
        <button className={`cursor-pointer text-xs font-semibold text-[#A1A1AA] hover:text-white rounded-md px-2 py-1 transition-colors duration-200 ${isActive ? "bg-[#7C3AED] text-white" : ""}`}
            onClick={() => setAggregationType(aggregationType)}>{title}</button>
    );
}

export default AggregationButton;