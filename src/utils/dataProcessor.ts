export interface Campaign {
  id: string;
  name: string;
  platform: string;
}

export interface Metric {
  campaignId: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  revenue: number;
}

export interface RawData {
  campaigns: Campaign[];
  metrics: Metric[];
}

export interface AggregatedDataPoint {
  label: string;
  timestamp: number;
  clicks: number;
  revenue: number;
  impressions: number;
  campaignsActive: number;
}

export type AggregationType = "Hourly" | "Daily" | "Weekly" | "Monthly";

export const fetchData = async (): Promise<RawData> => {
  const response = await fetch("/data.json");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

const dateCache = new Map<string, Date>();

const getOrParseDate = (timestamp: string): Date => {
  let date = dateCache.get(timestamp);
  if (!date) {
    date = new Date(timestamp);
    dateCache.set(timestamp, date);
  }
  return date;
};

const getHourlyKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  return `${year}-${month}-${day}-${hour}`;
};

const getDailyKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeeklyKey = (date: Date): string => {
  const tempDate = new Date(date);
  const day = tempDate.getDay();
  const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1);
  tempDate.setDate(diff);
  tempDate.setHours(0, 0, 0, 0);
  return tempDate.getTime().toString();
};

const getMonthlyKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()}`;
};

export const aggregateData = (
  metrics: Metric[],
  aggregation: AggregationType
): AggregatedDataPoint[] => {
  const groups = new Map<string, {
    label: string;
    timestamp: number;
    clicks: number;
    revenue: number;
    impressions: number;
    campaignIds: Set<string>;
  }>();

  let getKey: (date: Date) => string;
  let getTimestamp: (date: Date) => number;
  let getLabel: (date: Date) => string;

  switch (aggregation) {
    case "Hourly":
      getKey = getHourlyKey;
      getTimestamp = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(0, 0, 0);
        return d.getTime();
      };
      getLabel = (date: Date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      };
      break;
    case "Daily":
      getKey = getDailyKey;
      getTimestamp = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      };
      getLabel = (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
      };
      break;
    case "Weekly":
      getKey = getWeeklyKey;
      getTimestamp = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      };
      getLabel = (date: Date) => {
        const weekNum = getWeekNumber(date);
        return `Wk ${weekNum}`;
      };
      break;
    case "Monthly":
      getKey = getMonthlyKey;
      getTimestamp = (date: Date) => {
        const d = new Date(date);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      };
      getLabel = (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = String(date.getFullYear()).slice(-2);
        return `${months[date.getMonth()]} ${year}`;
      };
      break;
  }

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i];
    const date = getOrParseDate(metric.timestamp);
    const key = getKey(date);

    let group = groups.get(key);
    if (!group) {
      group = {
        label: getLabel(date),
        timestamp: getTimestamp(date),
        clicks: 0,
        revenue: 0,
        impressions: 0,
        campaignIds: new Set(),
      };
      groups.set(key, group);
    }

    group.clicks += metric.clicks;
    group.revenue += metric.revenue;
    group.impressions += metric.impressions;
    group.campaignIds.add(metric.campaignId);
  }

  const result: AggregatedDataPoint[] = [];
  groups.forEach((group) => {
    result.push({
      label: group.label,
      timestamp: group.timestamp,
      clicks: group.clicks,
      revenue: group.revenue,
      impressions: group.impressions,
      campaignsActive: group.campaignIds.size,
    });
  });

  result.sort((a, b) => a.timestamp - b.timestamp);
  return result;
};

function getWeekNumber(d: Date): number {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return weekNo;
}
