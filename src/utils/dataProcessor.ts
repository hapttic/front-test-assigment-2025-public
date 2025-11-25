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

export const aggregateData = (
  metrics: Metric[],
  aggregation: AggregationType
): AggregatedDataPoint[] => {
  const groups: {
    [key: string]: AggregatedDataPoint & { campaignIds: Set<string> };
  } = {};

  metrics.forEach((metric) => {
    const date = new Date(metric.timestamp);
    let key = "";
    let label = "";
    let groupTimestamp = 0;

    switch (aggregation) {
      case "Hourly": {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        label = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const hourDate = new Date(date);
        hourDate.setMinutes(0, 0, 0);
        groupTimestamp = hourDate.getTime();
        break;
      }
      case "Daily": {
        key = date.toISOString().split("T")[0];
        label = date.toLocaleDateString([], { month: "short", day: "numeric" });
        const dayDate = new Date(date);
        dayDate.setHours(0, 0, 0, 0);
        groupTimestamp = dayDate.getTime();
        break;
      }
      case "Weekly": {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        key = startOfWeek.getTime().toString();
        label = `Wk ${getWeekNumber(date)}`;
        groupTimestamp = startOfWeek.getTime();
        break;
      }
      case "Monthly": {
        key = `${date.getFullYear()}-${date.getMonth()}`;
        label = date.toLocaleDateString([], {
          month: "short",
          year: "2-digit",
        });
        const monthDate = new Date(date);
        monthDate.setDate(1);
        monthDate.setHours(0, 0, 0, 0);
        groupTimestamp = monthDate.getTime();
        break;
      }
    }

    if (!groups[key]) {
      groups[key] = {
        label,
        timestamp: groupTimestamp,
        clicks: 0,
        revenue: 0,
        impressions: 0,
        campaignsActive: 0,
        campaignIds: new Set(),
      };
    }

    groups[key].clicks += metric.clicks;
    groups[key].revenue += metric.revenue;
    groups[key].impressions += metric.impressions;
    groups[key].campaignIds.add(metric.campaignId);
  });

  return Object.values(groups)
    .map((group) => ({
      ...group,
      campaignsActive: group.campaignIds.size,
      campaignIds: undefined,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
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
