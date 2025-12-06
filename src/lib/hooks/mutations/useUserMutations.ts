import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/constants';
import { ApiError, CreateUserPayload, PaginatedResponse, UpdateUserPayload, User } from '@/types/api';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UpdateUserVariables {
  id: string;
  payload: UpdateUserPayload;
}

interface UpdateUserContext {
  previousUser?: User;
}

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
