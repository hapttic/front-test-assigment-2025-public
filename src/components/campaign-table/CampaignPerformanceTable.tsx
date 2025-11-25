import React, { useState } from "react"
import { TableHeader } from "./TableHeader"
import type { CampaignMetrics } from "../../types"; 
import { BarChart3 } from "lucide-react";
import { TableRow } from "./TableRow";


const CampaignPerformanceTable: React.FC = () => {

  const [sortConfig, setSortConfig] = useState<{ key: keyof CampaignMetrics; dir: 'asc' | 'desc' }>({
    key: 'timestamp',
    dir: 'desc' 
  })

  const handleSort = (key: keyof CampaignMetrics) => {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-lg font-bold text-slate-900 uppercase flex items-center gap-2 bg-[#37e6aa] size-fit p-2 mb-2 rounded-lg">
            <BarChart3 size={20} className="text-indigo-600" />
            Campaign Performance
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <TableHeader sortConfig={sortConfig} onSort={handleSort} />
                    <tbody className="divide-y divide-slate-100">
                      <TableRow />
                  </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default CampaignPerformanceTable