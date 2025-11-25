export default function CampaignMetrics() {
  const metrics = [
    {
      label: "Label 1",
      value: 125,
      color: "text-chart-1",
    },
    {
      label: "Label 2",
      value: 125,
      color: "text-chart-2",
    },
    {
      label: "Label 3",
      value: 125,
      color: "text-chart-3",
    },
    {
      label: "Label 4",
      value: 125,
      color: "text-chart-4",
    },
    {
      label: "Label 5",
      value: 125,
      color: "text-chart-5",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-border bg-card p-6"
        >
          <p className="text-sm text-muted-foreground">{metric.label}</p>
          <p className={`mt-2 text-3xl font-semibold ${metric.color}`}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
