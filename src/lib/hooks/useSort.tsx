import { useMemo, useState } from "react";
import type { AggregatedData, sortBy, SortOrder } from "../types";

export default function useSort(data: AggregatedData[]) {
  const [sortBy, setSortBy] = useState<sortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  function formatValue(value: number, label: string) {
    if (label === "Total Revenue") {
      return `$ ${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return value.toLocaleString();
  }

  const sortedData = useMemo(() => {
    function sortSwitch(a: AggregatedData, b: AggregatedData) {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case "campaigns":
          aValue = a.campaignsActive;
          bValue = b.campaignsActive;
          break;
        case "impressions":
          aValue = a.totalImpressions;
          bValue = b.totalImpressions;
          break;
        case "clicks":
          aValue = a.totalClicks;
          bValue = b.totalClicks;
          break;
        case "revenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }

    const sorted = [...data].sort((a, b) => sortSwitch(a, b));
    return sorted;
  }, [data, sortBy, sortOrder]);

  function handleSort(column: sortBy) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  const activeSortClass = (sort: sortBy) =>
    sortBy === sort ? "text-primary" : "text-muted-foreground";

  return {
    sortedData,
    handleSort,
    activeSortClass,
    formatValue,
    sortBy,
    sortOrder,
  };
}
