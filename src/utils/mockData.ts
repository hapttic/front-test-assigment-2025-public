import type { AggregatedData, AggregationLevel } from "../types";

export const createMockAggregatedData = (aggregation: AggregationLevel): AggregatedData[] => {
  const baseData: AggregatedData[] = [
    {
      period: "2024-01-01",
      periodStart: new Date("2024-01-01"),
      campaignsActive: ["campaign-1", "campaign-2"],
      totalImpressions: 15000,
      totalClicks: 450,
      totalRevenue: 1250.5,
    },
    {
      period: "2024-01-02",
      periodStart: new Date("2024-01-02"),
      campaignsActive: ["campaign-1", "campaign-2", "campaign-3"],
      totalImpressions: 18000,
      totalClicks: 520,
      totalRevenue: 1420.75,
    },
    {
      period: "2024-01-03",
      periodStart: new Date("2024-01-03"),
      campaignsActive: ["campaign-2", "campaign-3"],
      totalImpressions: 12000,
      totalClicks: 380,
      totalRevenue: 980.25,
    },
  ];

  return baseData.map((item) => ({
    ...item,
    period:
      aggregation === "weekly"
        ? "2024-W01"
        : aggregation === "monthly"
        ? "2024-01"
        : aggregation === "hourly"
        ? "2024-01-01 14:00"
        : item.period,
  }));
};
