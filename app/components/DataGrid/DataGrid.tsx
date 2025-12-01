"use client";

import { useState } from "react";
import { AggregatedRow } from "@/app/lib/types";
import { formatDateDisplay } from "@/app/lib/formatDate";
import styles from "./DataGrid.module.css";

interface Props {
    rows: AggregatedRow[];
}

type SortKey = "date" | "revenue";

export function DataGrid({ rows }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [direction, setDirection] = useState<"asc" | "desc">("asc");

    const sortRows = (key: SortKey) => {
        if (sortKey === key) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setDirection("asc");
        }
    };

    const sortedRows = [...rows].sort((a, b) => {
        let x: number | string = a[sortKey];
        let y: number | string = b[sortKey];

        if (sortKey === "date") {
            x = normalizeDate(a.date);
            y = normalizeDate(b.date);
        }

        return direction === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
    });

    function normalizeDate(value: string): number {
        if (value.includes("T") || value.length === 10) {
            return new Date(value).getTime();
        }

        if (value.length === 7) {
            const [year, month] = value.split("-");
            return new Date(Number(year), Number(month) - 1, 1).getTime();
        }

        if (value.includes("W")) {
            const [yr, wk] = value.split("-W");
            const year = Number(yr);
            const week = Number(wk);

            const first = new Date(year, 0, 1);
            const dayOffset = first.getDay() === 0 ? -6 : 1 - first.getDay();
            const startOfWeek = new Date(year, 0, 1 + dayOffset + (week - 1) * 7);
            return startOfWeek.getTime();
        }

        return 0;
    }

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => sortRows("date")}>
                            Date
                            <span className={styles.sortIcon}>
                                {sortKey === "date" ? (direction === "asc" ? "↑" : "↓") : ""}
                            </span>
                        </th>

                        <th>Campaigns Active</th>
                        <th>Impressions</th>
                        <th>Clicks</th>

                        <th onClick={() => sortRows("revenue")}>
                            Revenue
                            <span className={styles.sortIcon}>
                                {sortKey === "revenue" ? (direction === "asc" ? "↑" : "↓") : ""}
                            </span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {sortedRows.map((row) => (
                        <tr key={`${row.date}-${row.revenue}-${row.clicks}`}>
                            <td>{formatDateDisplay(row.date)}</td>
                            <td>{row.campaignsActive}</td>
                            <td >{row.impressions.toLocaleString()}</td>
                            <td>{row.clicks.toLocaleString()}</td>
                            <td className={styles.revenue} >${row.revenue.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
