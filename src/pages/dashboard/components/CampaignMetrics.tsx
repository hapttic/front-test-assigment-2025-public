import type { AggregatedData } from "../../../lib/types";

interface props {
  data: AggregatedData[];
}
export default function CampaignMetrics({ data }: props) {
  const totals = data.reduce(
    (acc, curr) => {
      acc.revenue += curr.totalRevenue;
      acc.clicks += curr.totalClicks;
      acc.impressions += curr.totalImpressions;
      return acc;
    },
    { revenue: 0, clicks: 0, impressions: 0 }
  );

  const metrics = [
    {
      label: "Total Revenue",
      value: totals.revenue,
      color: "text-chart-1",
    },
    {
      label: "Total Clicks",
      value: totals.clicks,
      color: "text-chart-2",
    },
    {
      label: "Total Impressions",
      value: totals.impressions,
      color: "text-chart-3",
    },
  ];

  function formatValue(value: number, label: string) {
    if (label === "Total Revenue") {
      return `$ ${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return value.toLocaleString();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2  lg:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-border bg-card p-6"
        >
          <p className="text-sm text-muted-foreground">{metric.label}</p>
          <p className={`mt-2 text-3xl font-semibold ${metric.color}`}>
            {formatValue(metric.value, metric.label)}
          </p>
        </div>
      ))}
    </div>
  );
}
