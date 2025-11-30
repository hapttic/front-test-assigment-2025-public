import { MetricType, type MetricTypeControlProps } from "../types/types";
import MetricTypeButton from "./MetricTypeButton";

function MetricTypeControl( { metricType, setMetricType } : MetricTypeControlProps) {
    return (<div className="flex items-center">
        <span>Show:</span>
        <div className="flex items-center">
            <MetricTypeButton 
                title="Revenue" 
                metricType={MetricType.REVENUE} 
                setMetricType={setMetricType}
                isActive={metricType === MetricType.REVENUE} />
            <MetricTypeButton 
                title="Clicks" 
                metricType={MetricType.CLICKS}
                setMetricType={setMetricType} 
                isActive={metricType === MetricType.CLICKS} />
        </div>
    </div>);
}

export default MetricTypeControl;