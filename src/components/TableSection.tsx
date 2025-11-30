import type { TableSectionProps } from "../types/types";
import Table from "./Table";

function TableSection({ metrics } : TableSectionProps ) {
    return <section className="w-full">
        <Table metrics={metrics} />
    </section>
}

export default TableSection;