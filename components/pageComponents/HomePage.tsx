"use client";
import { useFetchAnalytics } from "@/hooks/useFetchAnalytics";

const HomePage = () => {
  const { data } = useFetchAnalytics("daily");
  return <div>HomePage</div>;
};

export default HomePage;
