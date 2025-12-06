'use client';

import { useHasPermission } from '@/lib/hooks/common/usePermissions';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
	permission: string;
	children: ReactNode;
	redirectTo?: string;
}

/**
 * ProtectedRoute - Route-level permission protection
 * Redirects to 403 page (or custom route) if user doesn't have permission
 * @param permission - Permission string to check
 * @param children - Content to render if user has permission
 * @param redirectTo - Custom redirect path (default: '/403')
 */
export function ProtectedRoute({
	permission,
	children,
	redirectTo = '/403',
}: ProtectedRouteProps) {
	const hasPermission = useHasPermission(permission);
	const router = useRouter();

	useEffect(() => {
		if (!hasPermission) {
			router.push(redirectTo);
		}
	}, [hasPermission, redirectTo, router]);

	if (!hasPermission) {
		return null;
	}

	return <>{children}</>;
}

