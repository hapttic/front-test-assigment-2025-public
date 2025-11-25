import type { Metric, AggregatedSlot } from "../types";

export function aggregateMetrics(
  metrics: Metric[],
  mode: "hourly" | "daily" | "weekly" | "monthly"
): AggregatedSlot[] {
  const buckets = new Map<
    string,
    {
      start: Date;
      end: Date;
      impressions: number;
      clicks: number;
      revenue: number;
      campaignSet: Set<string>;
    }
  >();

  for (const m of metrics) {
    const date = new Date(m.timestamp);
    let key = "";

    if (mode === "hourly") key = date.toISOString().slice(0, 13); // 2025-08-26T12
    if (mode === "daily") key = date.toISOString().slice(0, 10); // 2025-08-26
    if (mode === "weekly") key = getWeekKey(date); // 2025-W35
    if (mode === "monthly") key = date.toISOString().slice(0, 7); // 2025-08

    if (!buckets.has(key)) {
      buckets.set(key, {
        start: date,
        end: date,
        impressions: 0,
        clicks: 0,
        revenue: 0,
        campaignSet: new Set(),
      });
    }

    const slot = buckets.get(key)!;
    slot.impressions += m.impressions;
    slot.clicks += m.clicks;
    slot.revenue += m.revenue;
    slot.campaignSet.add(m.campaignId);
  }
  return Array.from(buckets.values()).map((slot) => ({
    start: slot.start,
    end: slot.end,
    campaignsActive: slot.campaignSet.size,
    impressions: slot.impressions,
    clicks: slot.clicks,
    revenue: slot.revenue,
  }));
}

function getWeekKey(date: Date) {
  const temp = new Date(date);
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() - ((temp.getDay() + 6) % 7)); // start of week (Monday)
  const year = temp.getFullYear();
  const week = Math.ceil(((+temp - +new Date(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${week}`;
}
