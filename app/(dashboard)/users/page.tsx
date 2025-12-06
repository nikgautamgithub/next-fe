'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useUsers } from '@/lib/hooks/queries/useUsers';
import { useDebounce } from '@/lib/hooks/common/useDebounce';
import { formatters } from '@/lib/utils/format';
import { isEmpty } from 'lodash-es';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, error } = useUsers({
    search: debouncedSearch || undefined,
    page: 1,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage users and their permissions"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
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
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
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
  );
}
