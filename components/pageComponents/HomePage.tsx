"use client";
import { useFetchAnalytics } from "@/hooks/useFetchAnalytics";

const HomePage = () => {
  const { data } = useFetchAnalytics({
    aggregationType: "hourly",
    pageNumber: 1,
    pageSize: 10,
  });
  console.log(data);
  return <div>HomePage</div>;
};

export default HomePage;
