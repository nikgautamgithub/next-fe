import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { PaginatedResponse } from '@/types/api/common.types';
import { User, UserFilters } from '@/types/api/user.types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useUsers(
  filters: UserFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<User>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: queryKeys.users.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.USERS.LIST, {
        params: filters,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}
