import "./Filters.css";

export default function Filters({
    campaignFilter,
    setCampaignFilter,
    daysFilter,
    setDaysFilter
}) {
    return (
        <div className="filters">
            <select
                className="filter-select"
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
            >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
            </select>

            <select
                className="filter-select"
                value={daysFilter}
                onChange={(e) => setDaysFilter(e.target.value)}
            >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
            </select>
        </div>
    );
}
