export function formatDate(date: Date, mode: string) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hour = pad(date.getUTCHours());

  switch (mode) {
    case "hourly":
      return `${year}-${month}-${day}T${hour}:00`;

    case "daily":
      return `${year}-${month}-${day}`;

    case "weekly":
      return getISOWeekKey(date);

    case "monthly":
      return `${year}-${month}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

export function getISOWeekKey(date: Date): string {
  const temp = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const year = temp.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(year, 0, 4));
  const week = Math.ceil(((+temp - +firstThursday) / 86400000 + 1) / 7);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}
