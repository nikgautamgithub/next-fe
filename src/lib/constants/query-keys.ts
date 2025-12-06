import { UserFilters } from '@/types/api/user.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const authKeys = {
  me: ['auth', 'me'] as const,
  session: ['auth', 'session'] as const,
};

export const queryKeys = {
  users: userKeys,
  auth: authKeys,
} as const;
