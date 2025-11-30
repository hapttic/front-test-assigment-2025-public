import { useState } from "react";
import { TableSortType, type TableProps } from "../types/types";
import { ArrowUp, ArrowDown } from "lucide-react";
import Badge from "./Badge";

const INITIAL_DATA_SIZE = 20;
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
            <thead className="bg-white/[0.02] text-sm uppercase text-zinc-500 border-y border-white/5">
                <tr>
                    <th 
                        className="font-normal cursor-pointer py-3 px-6 hover:text-white transition-colors duration-200 flex items-center hover:bg-white/5" 
                        onClick={() => handleSortClick('date')}>
                            Date 
                            {sortType === TableSortType.TIME_ASC && <ArrowUp className="inline-block w-3 h-3 ml-1"/>}
                            {sortType === TableSortType.TIME_DESC && <ArrowUp className="inline-block w-3 h-3 ml-1 rotate-180"/>}
                        </th>
                    <th className="font-normal py-3 px-6">Active Campaigns</th>
                    <th className="font-normal py-3 px-6">Impressions</th>
                    <th className="font-normal py-3 px-6">Clicks</th>
                    <th 
                        className="font-normal cursor-pointer py-3 px-6 hover:text-white transition-colors duration-200 flex items-center hover:bg-white/5" 
                        onClick={() => handleSortClick('revenue')}>
                            Revenue
                            {sortType === TableSortType.REVENUE_ASC && <ArrowUp className="inline-block w-3 h-3 ml-1"/>}
                            {sortType === TableSortType.REVENUE_DESC && <ArrowUp className="inline-block w-3 h-3 ml-1 rotate-180"/>}
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
                {visibleMetrics.map((metric) => (
                    <tr key={metric.label} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-200 whitespace-nowrap">{metric.label}</td>
                        <td className="px-6 py-4"><Badge count={metric.campaigns.size}/></td>
                        <td className="px-6 py-4 text-zinc-400">{metric.impressions}</td>
                        <td className="px-6 py-4 text-zinc-400">{metric.clicks}</td>
                        <td className="px-6 py-4">${metric.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        {hasMore && (
                <button
                    onClick={handleLoadMore}
                    className="w-full text-white text-sm font-semibold rounded-b-xl bg-violet-600 hover:bg-violet-800 transition-colors cursor-pointer h-10 flex justify-center items-center gap-2 mt-4"
                >
                    Load More <ArrowDown className="w-4 h-4" />
                </button>
        )}
    </div>
}

export default Table;