import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants';
import { PaginatedResponse, User, UserFilters } from '@/types/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { isNil } from 'lodash-es';

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
    placeholderData: (previousData) => previousData, // Keep previous data during refetch
    ...options,
  });
}

export function useUser(
  id: string | null | undefined,
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
) {
  return useQuery<User>({
    queryKey: queryKeys.users.detail(id || ''),
    queryFn: async () => {
      if (isNil(id)) {
        throw new Error('User ID is required');
      }

      const { data } = await apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
      return data;
    },
    enabled: !isNil(id) && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}
