export function toDay(ts: string) {
  return ts.slice(0, 10);
}
export function toWeek(ts: string) {
  const date = new Date(ts);
  const year = date.getUTCFullYear();

  const tempDate = new Date(Date.UTC(year, 0, 1));
  const days = Math.floor((date.getTime() - tempDate.getTime()) / 86400000);
  const week = Math.ceil((days + tempDate.getUTCDay() + 1) / 7);

  return `${year}-W${week}`;
}
export function toMonth(ts: string) {
  return ts.slice(0, 7);
}
