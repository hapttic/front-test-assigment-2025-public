export default function CampaignMetrics() {
  const metrics = [
    {
      label: "Total Revenue",
      value: 125,
      color: "text-chart-1",
    },
    {
      label: "Total Clicks",
      value: 125,
      color: "text-chart-2",
    },
    {
      label: "Total Impressions",
      value: 125,
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
