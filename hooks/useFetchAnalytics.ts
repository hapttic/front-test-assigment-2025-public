import { useQuery } from "@tanstack/react-query";
import { AnalyticsApiResponse, DataFilters } from "../lib/interfaces/types";
import { getAnalytics } from "../lib/services/analytics.services";
import { analyticsDataQueryKey } from "../lib/constants/queryKeys";

// here I will use react query and aggregation parameter to handle caching advanced way
export const useFetchAnalytics = (filters: DataFilters) => {
  return useQuery<AnalyticsApiResponse | [], Error>({
    queryKey: [analyticsDataQueryKey, filters],
    queryFn: async () => getAnalytics(filters),
    staleTime: 1000 * 60,
  });
};
