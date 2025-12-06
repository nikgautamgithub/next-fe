import { PageHeader } from '@/components/shared';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to your production-grade Next.js application"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="text-primary h-5 w-5" />
              <CardTitle>Users</CardTitle>
            </div>
            <CardDescription>Manage users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={ROUTES.DASHBOARD.USERS.LIST}>
              <Button variant="outline" className="w-full">
                View Users <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
