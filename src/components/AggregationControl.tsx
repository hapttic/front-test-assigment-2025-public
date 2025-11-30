import { AggregationType, type AggregationControlProps } from "../types/types";
import AggregationButton from "./AggregationButton";

function AggregationControl({ aggregationType, setAggregationType }: AggregationControlProps) {
    return (
        <div className="flex items-center">
            <span>Group by:</span>
            <div>
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