import { useState } from "react";
import { TableSortType, type TableProps } from "../types/types";

const INITIAL_DATA_SIZE = 50;
const LOAD_MORE_STEP = 20;

function Table( { metrics }: TableProps) {
    const [sortType, setSortType] = useState<TableSortType>(TableSortType.TIME_DESC);

    const [visibleCount, setVisibleCount] = useState(INITIAL_DATA_SIZE);

    const getVisibleMetrics = () => {
        if (sortType === TableSortType.TIME_ASC) {
            return metrics
                .slice(0, visibleCount);
        } else if (sortType === TableSortType.TIME_DESC) {
            return metrics
                .slice(metrics.length - visibleCount, metrics.length)
                .reverse();
        } else if (sortType === TableSortType.REVENUE_ASC) {
            return metrics
                .slice()
                .sort((a, b) => a.revenue - b.revenue)
                .slice(0, visibleCount);
        } else if (sortType === TableSortType.REVENUE_DESC) {
            return metrics
                .slice()
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, visibleCount);
        }
        return [];
    }

    const visibleMetrics = getVisibleMetrics();
    const hasMore = metrics.length > visibleCount;

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + LOAD_MORE_STEP);
    };

    const handleSortClick = (clicked: 'date' | 'revenue') => {
        if (clicked === 'date') {
            if (sortType === TableSortType.TIME_DESC) {
                setSortType(TableSortType.TIME_ASC);
            } else {
                setSortType(TableSortType.TIME_DESC);
            }
        } else {
            if (sortType === TableSortType.REVENUE_DESC) {
                setSortType(TableSortType.REVENUE_ASC);
            } else {
                setSortType(TableSortType.REVENUE_DESC);
            }
        }
    }

    return <div>
        <table className="table-auto w-full text-left">
            <thead>
                <tr>
                    <th onClick={() => handleSortClick('date')}>Date</th>
                    <th>Active Campaigns</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th onClick={() => handleSortClick('revenue')}>Revenue</th>
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