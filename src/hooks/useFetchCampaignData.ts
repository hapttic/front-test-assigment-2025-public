import { useEffect, useState } from "react";
import type { Campaign, Metric } from "../types";

export function useFetchCampaignData() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns);
        setMetrics(data.metrics);
        setLoading(false);
      });
  }, []);

  return { campaigns, metrics, loading };
}
