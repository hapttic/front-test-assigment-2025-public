"use client";
import { useFetchAnalytics } from "@/hooks/useFetchAnalytics";

const HomePage = () => {
  const { data } = useFetchAnalytics({ aggregationType: "weekly" });
  return <div>HomePage</div>;
};

export default HomePage;
