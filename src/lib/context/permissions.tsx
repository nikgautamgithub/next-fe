'use client';

import { PermissionContextValue } from '@/types/permissions.types';
import { decodeToken, getTokenFromCookie } from '@/lib/utils/jwt';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
	children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
	const [permissionsSet, setPermissionsSet] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(true);

	const loadPermissions = useCallback(() => {
		setIsLoading(true);

		const token = getTokenFromCookie();
		if (!token) {
			setPermissionsSet(new Set());
			setIsLoading(false);
			return;
		}

		const payload = decodeToken(token);
		if (payload?.permissions && Array.isArray(payload.permissions)) {
			setPermissionsSet(new Set(payload.permissions));
		} else {
			setPermissionsSet(new Set());
		}

		setIsLoading(false);
	}, []);

	useEffect(() => {
		loadPermissions();

		// Re-check permissions periodically (every 5 seconds) in case token changed
		const interval = setInterval(loadPermissions, 5000);

		return () => clearInterval(interval);
	}, [loadPermissions]);

	const hasPermission = useCallback(
		(permission: string): boolean => {
			if (!permission || permissionsSet.size === 0) {
				return false;
			}
			return permissionsSet.has(permission);
		},
		[permissionsSet]
	);

	const value = useMemo<PermissionContextValue>(
		() => ({
			permissions: permissionsSet,
			hasPermission,
			isLoading,
		}),
		[permissionsSet, hasPermission, isLoading]
	);

	return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export { PermissionContext };

