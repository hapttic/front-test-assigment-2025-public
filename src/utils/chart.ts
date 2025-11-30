export function getTickValues(min: number, max: number, count: number): number[] {
  if (count < 1) return [];
  const range = max - min;
  return Array.from({ length: count + 1 }, (_, i) => min + (i * range) / count);
}


