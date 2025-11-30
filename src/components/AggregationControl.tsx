import { AggregationType, type AggregationControlProps } from "../types/types";
import AggregationButton from "./AggregationButton";

function AggregationControl({ aggregationType, setAggregationType }: AggregationControlProps) {
    return (
        <div className="flex items-center gap-3 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
            <span className="text-xs font-medium text-zinc-500 ml-2">Group by:</span>
            <div className="w-auto bg-[#1D1D1E] rounded-lg flex items-center gap-2 px-1 py-1 border border-white/5">
                <AggregationButton 
                    title="Hourly" 
                    aggregationType="HOURLY" 
                    setAggregationType={setAggregationType}
                    isActive={aggregationType === AggregationType.HOURLY} />
                <AggregationButton title="Daily" 
                    aggregationType="DAILY"
                    setAggregationType={setAggregationType} 
                    isActive={aggregationType === AggregationType.DAILY} />
                <AggregationButton title="Weekly" 
                    aggregationType="WEEKLY" 
                    setAggregationType={setAggregationType} 
                    isActive={aggregationType === AggregationType.WEEKLY} />
                <AggregationButton title="Monthly" 
                    aggregationType="MONTHLY" 
                    setAggregationType={setAggregationType} 
                    isActive={aggregationType === AggregationType.MONTHLY} />
            </div>
        </div>
    )
}

export default AggregationControl;