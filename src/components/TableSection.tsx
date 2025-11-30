import type { TableSectionProps } from "../types/types";
import Section from "./Section";
import Table from "./Table";
import { Calendar } from 'lucide-react';

function TableSection({ metrics } : TableSectionProps ) {
    return <Section>
        <div className="font-semibold text-white flex items-center gap-2 bg-white/[0.02] p-6 rounded-md">
            <Calendar className="w-4 h-4 text-violet-400"/>
            <h2 className="font-semibold text-white flex items-center gap-2">Performance Breakdown</h2>
        </div>
        <Table metrics={metrics} />
    </Section>
}

export default TableSection;
