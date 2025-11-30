import { AggregatedRow } from "../lib/types";
import styles from "./TimelineChart.module.css";


interface Props {
    data: AggregatedRow[];
    metric?: "clicks" | "revenue";
    mode: "hourly" | "daily" | "weekly" | "monthly";
}

export function TimelineChart({ mode, data, metric = "clicks" }: Props) {
    if (!data || data.length === 0) return <p>No data available</p>;

    const simplify = (arr: AggregatedRow[]) => {
        let limit = 200;

        if (mode === "hourly") limit = 200;
        if (mode === "daily") limit = 200;
        if (mode === "weekly") limit = 200;
        if (mode === "monthly") limit = 100;

        if (arr.length <= limit) return arr;

        const step = Math.ceil(arr.length / limit);
        return arr.filter((_, i) => i % step === 0);
    };

    const simplified = simplify(data);

    const values = simplified.map((d) => d[metric]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue || 1;

    const width = 1200;
    const height = 300;
    const padding = { top: 20, right: 2, bottom: 65, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xScale = (index: number) => (index / (simplified.length - 1 || 1)) * chartWidth;
    const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
        const value = minValue + (valueRange * i) / (tickCount - 1);
        return { value, y: yScale(value) };
    });

    const pathData = simplified
        .map((d, i) => {
            const x = xScale(i);
            const y = yScale(d[metric]);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        })
        .join(" ");

    const areaPath = `${pathData} L ${xScale(simplified.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;

    const gradientId = `gradient-${metric}`;

    return (
        <div className={styles.wrapper}>
            <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart} preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" className={styles.gradientStart} />
                        <stop offset="100%" className={styles.gradientEnd} />
                    </linearGradient>
                </defs>

                <g transform={`translate(${padding.left}, ${padding.top})`}>
                    {yTicks.map((tick, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={tick.y}
                            x2={chartWidth}
                            y2={tick.y}
                            className={styles.gridLine}
                        />
                    ))}

                    <path d={areaPath} fill={`url(#${gradientId})`} />

                    <path d={pathData} className={styles.line} />

                    {simplified.map((d, i) => (
                        <g key={i}>
                            <circle
                                cx={xScale(i)}
                                cy={yScale(d[metric])}
                                r="4"
                                className={styles.pointOuter}
                            />
                            <circle
                                cx={xScale(i)}
                                cy={yScale(d[metric])}
                                r="8"
                                className={styles.pointHover}
                            />
                        </g>
                    ))}

                    <line x1="0" y1="0" x2="0" y2={chartHeight} className={styles.axis} />

                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} className={styles.axis} />

                    {yTicks.map((tick, i) => (
                        <text
                            key={i}
                            x="-10"
                            y={tick.y}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className={styles.axisLabel}
                        >
                            {Math.round(tick.value).toLocaleString()}
                        </text>
                    ))}

                    {simplified.map((d, i) => {
                        const showEvery = Math.ceil(simplified.length / 6);
                        if (i % showEvery !== 0 && i !== simplified.length - 1) return null;

                        return (
                            <text
                                key={i}
                                x={xScale(i)}
                                y={chartHeight + 15}
                                textAnchor="end"
                                transform={`rotate(-45, ${xScale(i)}, ${chartHeight + 15})`}
                                className={styles.axisLabel}
                            >
                                {d.date}
                            </text>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
