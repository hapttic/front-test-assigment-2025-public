export function formatDate(date: Date, mode: string) {
  if (mode === "hourly") {
    return date.toISOString().slice(0, 13) + ":00"; // YYYY-MM-DDTHH:00
  }
  if (mode === "daily") {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  if (mode === "monthly") {
    return date.toISOString().slice(0, 7); // YYYY-MM
  }
  if (mode === "weekly") {
    return date.toISOString().slice(0, 10); // Monday date
  }
  return date.toISOString();
}
