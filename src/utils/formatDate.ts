// export function formatDate(date: Date, mode: string) {
//   if (mode === "hourly") {
//     return date.toISOString().slice(0, 13) + ":00"; // YYYY-MM-DDTHH:00
//   }
//   if (mode === "daily") {
//     return date.toISOString().slice(0, 10); // YYYY-MM-DD
//   }
//   if (mode === "monthly") {
//     return date.toISOString().slice(0, 7); // YYYY-MM
//   }
//   if (mode === "weekly") {
//     return date.toISOString().slice(0, 10); // Monday date
//   }
//   return date.toISOString();
// }

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
      // Option 1:
      const monday = new Date(date);
      const dayOfWeek = monday.getUTCDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      monday.setUTCDate(monday.getUTCDate() + diff);
      return `${monday.getUTCFullYear()}-${pad(monday.getUTCMonth() + 1)}-${pad(
        monday.getUTCDate()
      )}`;

    // Option 2:
    // return getISOWeekKey(date);

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
