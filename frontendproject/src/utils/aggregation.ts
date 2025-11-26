import type {
  AggregatedBucket,
  AggregationLevel,
  MetricRecord,
} from "../types/data";

// every number becomes two digit, pad(3) = 03;
const pad = (n: number) => String(n).padStart(2, "0");

// fetch label but in the date and level we want
const getLabel = (date: Date, level: AggregationLevel) => {
  // split date param into year,month,day,hour
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hour = pad(date.getUTCHours());

  // format our variables output the way user wishes to get,
  if (level === "hourly") {
    return `${year}-${month}-${day} ${hour}:00`;
  } else if (level === "daily") {
    return `${year}-${month}-${day}`;
  } else if (level === "weekly") {
    return `week ${year} - ${month} - ${day}`;
  } else {
    return `${year} - ${month}`;
  }
};

// return an array of total clicks over a time period
export const aggregateMetrics = (
  metrics: MetricRecord[],
  level: AggregationLevel
): AggregatedBucket[] => {
  type TempBucket = AggregatedBucket & { campaignIds: Set<string> };
  const groups = new Map<string, TempBucket>(); // map to store buckets

  // iterate over timestamp and clicks of each metric
  for (const { timestamp, clicks, impressions, revenue, campaignId } of metrics) {
    const date = new Date(timestamp);
    const label = getLabel(date, level);
    const key = `${level}-${label}`; // calculate unique key for map

    // default val of 0 for each if null
    const bucket = groups.get(key) ?? {
      key,
      label,
      date: timestamp,
      campaignsActive: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalRevenue: 0,
      campaignIds: new Set<string>(),
    };
    bucket.totalClicks += clicks;
    bucket.totalImpressions += impressions;
    bucket.totalRevenue += revenue;
    bucket.campaignIds.add(campaignId);
    groups.set(key, bucket);
  }

  return [...groups.values()]
    .map((bucket) => ({
      key: bucket.key,
      label: bucket.label,
      date: bucket.date,
      campaignsActive: bucket.campaignIds.size,
      totalImpressions: bucket.totalImpressions,
      totalClicks: bucket.totalClicks,
      totalRevenue: bucket.totalRevenue,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
