import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { ApiError } from '@/types/api/common.types';

export function useDeleteUser(
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });

      toast.success('User deleted successfully', {
        description: 'The user has been removed from the system.',
      });
    },
    onError: (error) => {
      toast.error('Failed to delete user', {
        description: error.message || 'An unexpected error occurred',
      });
    },
    ...options,
  });
}
