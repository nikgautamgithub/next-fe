import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { ROUTES } from '@/lib/constants/routes';
import { LoginPayload, LoginResponse } from '@/types/api/auth.types';
import { ApiError } from '@/types/api/common.types';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin(
  options?: Omit<UseMutationOptions<LoginResponse, ApiError, LoginPayload>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me, data.user);

      toast.success('Login successful', {
        description: `Welcome back, ${data.user.firstName}!`,
      });

      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error) => {
      toast.error('Login failed', {
        description: error.message || 'Invalid credentials',
      });
    },
    ...options,
  });
}
