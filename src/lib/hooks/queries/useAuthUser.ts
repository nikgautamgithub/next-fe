import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { AuthUser } from '@/types/api/auth.types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useAuthUser(options?: Omit<UseQueryOptions<AuthUser>, 'queryKey' | 'queryFn'>) {
  return useQuery<AuthUser>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for auth user
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: false, // Don't retry auth requests
    ...options,
  });
}
