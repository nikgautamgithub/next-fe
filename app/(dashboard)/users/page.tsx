'use client';

import { EmptyState, LoadingSpinner, PageHeader, PermissionGuard, ProtectedRoute } from '@/components/shared';
import { Button, Card, Input } from '@/components/ui';
import { PERMISSIONS } from '@/lib/constants';
import { useDebounce, useUsers } from '@/lib/hooks';
import { useHasPermission } from '@/lib/hooks/common/usePermissions';
import { formatters } from '@/lib/utils';
import { isEmpty } from 'lodash-es';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, error } = useUsers({
    search: debouncedSearch || undefined,
    page: 1,
    limit: 10,
  });

  return (
    <ProtectedRoute permission={PERMISSIONS.USERS.READ}>
      <div className="space-y-6">
        <PageHeader
          title="Users"
          description="Manage users and their permissions"
          actions={
            <PermissionGuard permission={PERMISSIONS.USERS.CREATE}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </PermissionGuard>
          }
        />

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading users..." />
        </div>
      )}

      {isError && (
        <Card className="p-6">
          <EmptyState
            title="Error loading users"
            description={error?.message || 'An unexpected error occurred'}
          />
        </Card>
      )}

      {!isLoading && !isError && isEmpty(data?.data) && (
        <Card className="p-6">
          <EmptyState
            title="No users found"
            description={
              debouncedSearch
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first user'
            }
            action={
              !debouncedSearch && (
                <PermissionGuard permission={PERMISSIONS.USERS.CREATE}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </PermissionGuard>
              )
            }
          />
        </Card>
      )}

      {!isLoading && !isError && !isEmpty(data?.data) && (
        <div className="space-y-4">
          {data?.data.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {formatters.fullName(user.firstName, user.lastName)}
                  </h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Joined {formatters.date(user.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {user.role}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
