'use client';

import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Home, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD.HOME, icon: Home },
  { name: 'Users', href: ROUTES.DASHBOARD.USERS.LIST, icon: Users },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href={ROUTES.DASHBOARD.HOME} className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Recruiter App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'hover:text-foreground/80 flex items-center gap-2 transition-colors',
                    isActive ? 'text-foreground' : 'text-foreground/60'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
