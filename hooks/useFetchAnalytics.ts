import { useQuery } from "@tanstack/react-query";
import { AggregatedData, Aggregation } from "../lib/interfaces/types";
import { getAnalytics } from "../lib/services/analytics.services";
import { analyticsDataQueryKey } from "../lib/constants/queryKeys";

// here I will use react query and aggregation parameter to handle caching advanced way
export const useFetchAnalytics = (aggregationType: Aggregation) => {
  return useQuery<AggregatedData[] | [], Error>({
    queryKey: [analyticsDataQueryKey, aggregationType],
    queryFn: async () => getAnalytics(aggregationType),
    staleTime: 1000 * 60,
  });
};
