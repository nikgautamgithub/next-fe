'use client';

import { PermissionContext } from '@/lib/context/permissions';
import { useMemo } from 'react';
import { useContext } from 'react';

/**
 * Access the permission context
 * @returns Permission context value
 */
export function usePermissions() {
	const context = useContext(PermissionContext);

	if (context === undefined) {
		throw new Error('usePermissions must be used within a PermissionProvider');
	}

	return context;
}

/**
 * Check if user has a specific permission
 * @param permission - Permission string (e.g., 'users:read')
 * @returns Boolean indicating if user has the permission
 */
export function useHasPermission(permission: string): boolean {
	const { hasPermission } = usePermissions();

	return useMemo(() => hasPermission(permission), [hasPermission, permission]);
}

