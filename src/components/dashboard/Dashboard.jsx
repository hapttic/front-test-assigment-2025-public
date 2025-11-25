import "./Dashboard.css";
import Filters from "../filters/Filters";
import MetricsGrid from "../metrics/MetricsGrid";
import ChartSection from "../charts/ChartSection";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <Filters />
            <MetricsGrid />
            <ChartSection />
        </div>
    );
}
