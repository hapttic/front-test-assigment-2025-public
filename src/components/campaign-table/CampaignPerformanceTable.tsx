import React, { useState, useMemo } from "react";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import type { AggregatedPoint } from "../../hooks/useCampaignAnalytics";

interface Props {
  data: AggregatedPoint[];
}

const ITEMS_PER_PAGE = 20; 

const CampaignPerformanceTable: React.FC<Props> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof AggregatedPoint; dir: 'asc' | 'desc' }>({
    key: 'timestamp', 
    dir: 'desc' 
  });

  const handleSort = (key: keyof AggregatedPoint) => {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedFullData = useMemo(() => {
    if (!data) return [];
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.dir === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedFullData.length / ITEMS_PER_PAGE);
  
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedFullData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, sortedFullData]);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900 uppercase flex items-center gap-2 bg-[#37e6aa] size-fit p-2 rounded-lg shadow-sm">
                <BarChart3 size={20} className="text-[#114341]" />
                Campaign Performance
            </h2>
            
            {/* Pagination Controls (Top) */}
            <div className="text-sm text-slate-500">
                Showing {sortedFullData.length} rows
            </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <TableHeader sortConfig={sortConfig} onSort={handleSort} />
                    
                    <tbody className="divide-y divide-slate-100">
                      {currentTableData.length > 0 ? (
                        currentTableData.map((row) => (
                          <TableRow key={row.timestamp} data={row} />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            No data available for this period
                          </td>
                        </tr>
                      )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {sortedFullData.length > ITEMS_PER_PAGE && (
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default CampaignPerformanceTable;