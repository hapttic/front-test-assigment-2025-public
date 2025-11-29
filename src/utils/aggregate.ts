import type { Metric, AggregatedSlot } from "../types";
import { formatDate } from "./formatDate";

// export function aggregateMetrics(
//   metrics: Metric[],
//   mode: "hourly" | "daily" | "weekly" | "monthly"
// ): AggregatedSlot[] {
//   const buckets = new Map<
//     string,
//     {
//       start: Date;
//       end: Date;
//       impressions: number;
//       clicks: number;
//       revenue: number;
//       campaignSet: Set<string>;
//     }
//   >();

//   for (const m of metrics) {
//     const date = new Date(m.timestamp);
//     let key = "";

//     if (mode === "hourly") key = date.toISOString().slice(0, 13); // 2025-08-26T12
//     if (mode === "daily") key = date.toISOString().slice(0, 10); // 2025-08-26
//     if (mode === "weekly") key = getWeekKey(date); // 2025-W35
//     if (mode === "monthly") key = date.toISOString().slice(0, 7); // 2025-08

//     if (!buckets.has(key)) {
//       buckets.set(key, {
//         start: date,
//         end: date,
//         impressions: 0,
//         clicks: 0,
//         revenue: 0,
//         campaignSet: new Set(),
//       });
//     }

//     const slot = buckets.get(key)!;
//     slot.impressions += m.impressions;
//     slot.clicks += m.clicks;
//     slot.revenue += m.revenue;
//     slot.campaignSet.add(m.campaignId);
//   }
//   return Array.from(buckets.values()).map((slot) => ({
//     start: formatDate(slot.start, mode),
//     end: formatDate(slot.end, mode),
//     campaignsActive: slot.campaignSet.size,
//     impressions: slot.impressions,
//     clicks: slot.clicks,
//     revenue: slot.revenue,
//   }));
// }

// function getWeekKey(date: Date) {
//   const temp = new Date(date);
//   temp.setHours(0, 0, 0, 0);
//   temp.setDate(temp.getDate() - ((temp.getDay() + 6) % 7));
//   const year = temp.getFullYear();
//   const week = Math.ceil(((+temp - +new Date(year, 0, 1)) / 86400000 + 1) / 7);
//   return `${year}-W${week}`;
// }

// export function aggregateMetrics(
//   metrics: Metric[],
//   mode: "hourly" | "daily" | "weekly" | "monthly"
// ): AggregatedSlot[] {
//   const buckets = new Map<
//     string,
//     {
//       start: Date;
//       end: Date;
//       impressions: number;
//       clicks: number;
//       revenue: number;
//       campaignSet: Set<string>;
//     }
//   >();

//   for (const m of metrics) {
//     const date = new Date(m.timestamp);

//     let bucketKey = "";
//     let start = new Date(date);
//     let end = new Date(date);

//     if (mode === "hourly") {
//       start = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         date.getDate(),
//         date.getHours()
//       );
//       end = new Date(start.getTime() + 60 * 60 * 1000);

//       bucketKey = start.toISOString(); // unique key
//     }

//     if (mode === "daily") {
//       start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//       end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

//       bucketKey = start.toISOString();
//     }

//     if (mode === "monthly") {
//       start = new Date(date.getFullYear(), date.getMonth(), 1);
//       end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

//       bucketKey = start.toISOString();
//     }

//     if (mode === "weekly") {
//       const day = date.getDay(); // 0-6 (Sunday=0)
//       const diff = day === 0 ? -6 : 1 - day; // Monday as start
//       start = new Date(date);
//       start.setDate(date.getDate() + diff);
//       start.setHours(0, 0, 0, 0);

//       end = new Date(start);
//       end.setDate(start.getDate() + 7);

//       bucketKey = start.toISOString();
//     }

//     if (!buckets.has(bucketKey)) {
//       buckets.set(bucketKey, {
//         start,
//         end,
//         impressions: 0,
//         clicks: 0,
//         revenue: 0,
//         campaignSet: new Set(),
//       });
//     }

//     const slot = buckets.get(bucketKey)!;

//     slot.impressions += m.impressions;
//     slot.clicks += m.clicks;
//     slot.revenue += m.revenue;
//     slot.campaignSet.add(m.campaignId);
//   }

//   // Format helper
//   const formatDate = (date: Date, mode: string) => {
//     if (mode === "hourly") {
//       return date.toISOString().slice(0, 13) + ":00"; // YYYY-MM-DDTHH:00
//     }
//     if (mode === "daily") {
//       return date.toISOString().slice(0, 10); // YYYY-MM-DD
//     }
//     if (mode === "monthly") {
//       return date.toISOString().slice(0, 7); // YYYY-MM
//     }
//     if (mode === "weekly") {
//       return date.toISOString().slice(0, 10); // Monday date
//     }
//     return date.toISOString();
//   };

//   return Array.from(buckets.values()).map((slot) => ({
//     start: slot.start,
//     end: slot.end,
//     campaignsActive: slot.campaignSet.size,
//     impressions: slot.impressions,
//     clicks: slot.clicks,
//     revenue: slot.revenue,
//   }));
// }

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
        // get Monday of the current week in UTC
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
