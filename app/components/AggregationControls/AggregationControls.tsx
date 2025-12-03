"use client";



import { useDashboardStore } from "../../store/useDashboardStore";
import styles from "./AggregationControls.module.css";

const modes = ["hourly", "daily", "weekly", "monthly"] as const;

export function AggregationControls() {
    const mode = useDashboardStore((s) => s.mode);
    const setMode = useDashboardStore((s) => s.setMode);

    return (
        <div className={styles.container}>
            {modes.map((m) => (
                <button
                    key={m}
                    className={`${styles.button} ${mode === m ? styles.active : ""}`}
                    onClick={() => setMode(m)}
                >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
            ))}
        </div>
    );
}
