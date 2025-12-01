export type AggregationMode = "hourly" | "daily" | "weekly" | "monthly";

export const AGGREGATION_OPTIONS: { value: AggregationMode; label: string }[] =
  [
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

export const CAMPAIGNS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "c1", label: "Q4 Awareness Blast (c1)" },
  { value: "c2", label: "Black Friday Retargeting (c2)" },
  { value: "c3", label: "SaaS Lead Gen - USA (c3)" },
  { value: "c4", label: "Competitor Conquesting (c4)" },
  { value: "c5", label: "User Reactivation (c5)" },
];
