import type {
  AggregatedBucket,
  AggregationLevel,
  MetricRecord,
} from "../types/data";

// every number becomes two digit, pad(3) = 03;
const pad = (n: number) => String(n).padStart(2, "0");

// Get the Monday of the week
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getUTCDay();
  const daysToSubtract = day === 0 ? 6 : day - 1;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - daysToSubtract);
  monday.setUTCHours(0, 0, 0, 0); // Normalize to start of day
  return monday;
};

// Get the first day of the month
const getStartOfMonth = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
};

// get bucket date depending on level an date param
const getBucketDate = (date: Date, level: AggregationLevel): Date => {
  if (level === "hourly" || level === "daily") {
    return date;
  } else if (level === "weekly") {
    return getStartOfWeek(date);
  } else {
    // monthly
    return getStartOfMonth(date);
  }
};

// Get label for display based on the bucket date
const getLabel = (bucketDate: Date, level: AggregationLevel): string => {
  const year = bucketDate.getUTCFullYear();
  const month = pad(bucketDate.getUTCMonth() + 1);
  const day = pad(bucketDate.getUTCDate());
  const hour = pad(bucketDate.getUTCHours());

  if (level === "hourly") {
    return `${year}-${month}-${day} ${hour}:00`;
  } else if (level === "daily") {
    return `${year}-${month}-${day}`;
  } else if (level === "weekly") {
    const weekEnd = new Date(bucketDate);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    const endYear = weekEnd.getUTCFullYear();
    const endDay = pad(weekEnd.getUTCDate());
    const endMonth = pad(weekEnd.getUTCMonth() + 1);
    return `${year}-${month}-${day} to ${endYear}-${endMonth}-${endDay}`;
  } else {
    // monthly
    return `${year}-${month}`;
  }
};

// Generate a unique key for grouping
const getBucketKey = (bucketDate: Date, level: AggregationLevel): string => {
  const year = bucketDate.getUTCFullYear();
  const month = pad(bucketDate.getUTCMonth() + 1);
  const day = pad(bucketDate.getUTCDate());
  const hour = pad(bucketDate.getUTCHours());

  if (level === "hourly") {
    return `${level}-${year}-${month}-${day}-${hour}`;
  } else if (level === "daily") {
    return `${level}-${year}-${month}-${day}`;
  } else if (level === "weekly") {
    // Use year-month-day of Monday as key for consistent grouping
    return `${level}-${year}-${month}-${day}`;
  } else {
    // monthly
    return `${level}-${year}-${month}`;
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
  for (const {
    timestamp,
    clicks,
    impressions,
    revenue,
    campaignId,
  } of metrics) {
    const date = new Date(timestamp);
    // Get the normalized bucket date
    const bucketDate = getBucketDate(date, level);
    // Generate unique key for grouping
    const key = getBucketKey(bucketDate, level);

    // Get or create bucket
    let bucket = groups.get(key);
    if (!bucket) {
      // Create new bucket with normalized date and label
      const label = getLabel(bucketDate, level);
      bucket = {
        key,
        label,
        date: bucketDate.toISOString(),
        campaignsActive: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalRevenue: 0,
        campaignIds: new Set<string>(),
      };
      groups.set(key, bucket);
    }

    // Aggregate metrics
    bucket.totalClicks += clicks;
    bucket.totalImpressions += impressions;
    bucket.totalRevenue += revenue;
    bucket.campaignIds.add(campaignId);
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
