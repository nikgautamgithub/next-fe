import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants/query-keys';
import { ApiError, PaginatedResponse } from '@/types/api/common.types';
import { UpdateUserPayload, User } from '@/types/api/user.types';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UpdateUserVariables {
  id: string;
  payload: UpdateUserPayload;
}

interface UpdateUserContext {
  previousUser?: User;
}

export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<User, ApiError, UpdateUserVariables, UpdateUserContext>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, UpdateUserVariables, UpdateUserContext>({
    mutationFn: async ({ id, payload }: UpdateUserVariables) => {
      const { data } = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), payload);
      return data;
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(id) });

      const previousUser = queryClient.getQueryData<User>(queryKeys.users.detail(id));

      if (previousUser) {
        queryClient.setQueryData<User>(queryKeys.users.detail(id), {
          ...previousUser,
          ...payload,
        });
      }

      return { previousUser };
    },
    onError: (error, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData<User>(queryKeys.users.detail(id), context.previousUser);
      }

      toast.error('Failed to update user', {
        description: error.message || 'An unexpected error occurred',
      });
    },
    onSuccess: (data, { id }) => {
      queryClient.setQueryData<User>(queryKeys.users.detail(id), data);

      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: queryKeys.users.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((user) => (user.id === id ? data : user)),
          };
        }
      );

      toast.success('User updated successfully', {
        description: `${data.firstName} ${data.lastName} has been updated.`,
      });
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
    ...options,
  });
}
