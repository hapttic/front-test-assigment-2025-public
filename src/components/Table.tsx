import { useState } from "react";
import type { TableProps } from "../types/types";

const INITIAL_DATA = 50;
const LOAD_MORE_STEP = 20;

function Table( { metrics }: TableProps) {
    const [visibleCount, setVisibleCount] = useState(INITIAL_DATA);
    const visibleMetrics = metrics.slice(0, visibleCount);

    const hasMore = metrics.length > visibleCount;

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + LOAD_MORE_STEP);
    };

    return <div>
        <table className="table-auto w-full text-left">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Active Campaigns</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                {visibleMetrics.map((metric) => (
                    <tr key={metric.label}>
                        <td>{metric.label}</td>
                        <td>{metric.campaigns.size}</td>
                        <td>{metric.impressions}</td>
                        <td>{metric.clicks}</td>
                        <td>{metric.revenue.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        {hasMore && (
            <div className="flex justify-center mt-4">
                <button
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Load More ({metrics.length - visibleCount} remaining)
                </button>
            </div>
        )}
    </div>
}

export default Table;