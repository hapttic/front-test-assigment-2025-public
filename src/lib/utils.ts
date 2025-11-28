import type { AggregationPeriod } from "./types";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(
  timestamp: string,
  period: AggregationPeriod
): string {
  const date = new Date(timestamp);
  switch (period) {
    case "hourly":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    case "daily":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "weekly":
      return `Week of ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    case "monthly":
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
  }
}

export function formatNumber(number: number) {
  return number.toLocaleString("en-US", { minimumFractionDigits: 2 });
}
