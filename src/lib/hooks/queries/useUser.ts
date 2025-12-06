import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { User } from '@/types/api/user.types';
import { isNil } from 'lodash-es';

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
