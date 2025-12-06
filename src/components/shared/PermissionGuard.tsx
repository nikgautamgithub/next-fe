'use client';

import { useHasPermission } from '@/lib/hooks/common/usePermissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
	permission: string;
	children: ReactNode;
	fallback?: ReactNode;
	hide?: boolean;
}

/**
 * PermissionGuard - Conditionally render children based on permission
 * @param permission - Permission string to check
 * @param children - Content to render if user has permission
 * @param fallback - Content to render if user doesn't have permission (default: null)
 * @param hide - If true, remove from DOM instead of rendering fallback (default: false)
 */
export function PermissionGuard({
	permission,
	children,
	fallback = null,
	hide = false,
}: PermissionGuardProps) {
	const hasPermission = useHasPermission(permission);

	if (!hasPermission) {
		if (hide) {
			return null;
		}
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

