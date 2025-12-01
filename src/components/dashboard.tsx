import { aggregateMetrics } from "@/lib/_utils";
import type { AggregationMode } from "@/lib/constants";
import { useMemo, useState } from "react";
import campaignsData from "../../public/data.json";
import { CampaignTable } from "./campaign-table";
import { EChartsLineChart } from "./charts/echarts-line-chart";
import { DashboardControls } from "./dashboard-controls";

export const Dashboard = () => {
  const [aggregation, setAggregation] = useState<AggregationMode>("daily");
  const [campaignId, setCampaignId] = useState("all");

  const metricsData = useMemo(
    () =>
      aggregateMetrics({
        metrics: campaignsData.metrics,
        mode: aggregation,
        campaignId,
      }),
    [aggregation, campaignId]
  );

  return (
    <div>
      <DashboardControls
        aggregation={{ value: aggregation, onChange: setAggregation }}
        campaigns={{ value: campaignId, onChange: setCampaignId }}
      />

      <div className="mt-10">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mb-8">
          <EChartsLineChart
            data={metricsData.map((m) => ({
              x: m.period || m.timestamp,
              y: m.impressions,
              name: m.campaignId,
            }))}
            title="Impressions"
          />

          <EChartsLineChart
            data={metricsData.map((m) => ({
              x: m.period || m.timestamp,
              y: m.clicks,
              name: m.campaignId,
            }))}
            title="Clicks"
          />
          <EChartsLineChart
            data={metricsData.map((m) => ({
              x: m.period || m.timestamp,
              y: m.revenue,
              name: m.campaignId,
            }))}
            title="Revenue"
          />
        </div>

        <CampaignTable data={metricsData} />
      </div>
    </div>
  );
};
