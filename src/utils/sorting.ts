import type { AggregatedSlot } from '../lib/aggregation';
import type { SortBy, SortDir } from '../types/sorting';

export function sortAggregatedSlots(
  slots: AggregatedSlot[],
  sortBy: SortBy,
  sortDir: SortDir
): AggregatedSlot[] {
  const sorted = [...slots];
  sorted.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'date') {
      cmp = a.startUTC - b.startUTC;
    } else {
      cmp = a.totalRevenue - b.totalRevenue;
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}


