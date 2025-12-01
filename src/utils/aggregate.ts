import type { Metric, AggregatedSlot } from "../types";
import { formatDate } from "./formatDate";

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
    let bucketKey = "";
    let start: Date, end: Date;

    switch (mode) {
      case "hourly":
        start = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours()
          )
        );
        end = new Date(start.getTime() + 60 * 60 * 1000);
        bucketKey = start.toISOString();
        break;

      case "daily":
        start = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
        );
        end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        bucketKey = start.toISOString();
        break;

      case "weekly":
        // get monday of current week in utc
        const day = date.getUTCDay();
        const diff = day === 0 ? -6 : 1 - day;
        start = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + diff
          )
        );
        start.setUTCHours(0, 0, 0, 0);
        end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
        bucketKey = start.toISOString();
        break;

      case "monthly":
        start = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
        );
        end = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
        );
        bucketKey = start.toISOString();
        break;
    }

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, {
        start,
        end,
        impressions: 0,
        clicks: 0,
        revenue: 0,
        campaignSet: new Set(),
      });
    }

    const slot = buckets.get(bucketKey)!;
    slot.impressions += m.impressions;
    slot.clicks += m.clicks;
    slot.revenue += m.revenue;
    slot.campaignSet.add(m.campaignId);
  }

  return Array.from(buckets.values()).map((slot) => ({
    start: formatDate(slot.start, mode),
    end: formatDate(slot.end, mode),
    campaignsActive: slot.campaignSet.size,
    impressions: slot.impressions,
    clicks: slot.clicks,
    revenue: slot.revenue,
  }));
}
