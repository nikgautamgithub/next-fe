'use client';

import { decodeToken, getTokenFromCookie } from '@/lib/utils/jwt';
import { PermissionContextValue } from '@/types/permissions.types';
import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

function getPermissionsFromToken(): Set<string> {
  const token = getTokenFromCookie();
  if (!token) {
    return new Set();
  }

  const payload = decodeToken(token);
  if (payload?.permissions && Array.isArray(payload.permissions)) {
    return new Set(payload.permissions);
  }

  return new Set();
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const [permissionsSet] = useState<Set<string>>(getPermissionsFromToken);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!permission) {
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
      isLoading: false,
    }),
    [permissionsSet, hasPermission]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export { PermissionContext };
