import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { ApiError } from '@/types/api/common.types';
import { CreateUserPayload, User } from '@/types/api/user.types';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreateUser(
  options?: Omit<UseMutationOptions<User, ApiError, CreateUserPayload>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, CreateUserPayload>({
    mutationFn: async (payload: CreateUserPayload) => {
      const { data } = await apiClient.post(API_ENDPOINTS.USERS.CREATE, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast.success('User created successfully', {
        description: `${data.firstName} ${data.lastName} has been added.`,
      });
    },
    onError: (error) => {
      toast.error('Failed to create user', {
        description: error.message || 'An unexpected error occurred',
      });
    },
    ...options,
  });
}
