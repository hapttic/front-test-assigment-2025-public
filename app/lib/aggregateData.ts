import { JoinedMetric, AggregatedRow, AggregationMode } from "./types";
import { toDay, toWeek, toMonth } from "./dateHelpers";

export function aggregateData(
  data: JoinedMetric[],
  mode: AggregationMode
): AggregatedRow[] {

  const buckets = new Map<string, AggregatedRow>();

  for (const item of data) {
    let key = "";

    switch (mode) {
      case "hourly":
        key = item.timestamp.slice(0, 13); 
        break;
      case "daily":
        key = toDay(item.timestamp);
        break;
      case "weekly":
        key = toWeek(item.timestamp);
        break;
      case "monthly":
        key = toMonth(item.timestamp);
        break;
    }

    if (!buckets.has(key)) {
      buckets.set(key, {
        date: key,
        campaignsActive: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
      });
    }

    const bucket = buckets.get(key)!;

    bucket.impressions += item.impressions;
    bucket.clicks += item.clicks;
    bucket.revenue += item.revenue;

    bucket.campaignsActive += 1;
  }

  return Array.from(buckets.values()).sort(
    (a, b) => a.date.localeCompare(b.date)
  );
}
