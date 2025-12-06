import { JWTPayload } from './api/auth.types';

/**
 * Extended JWT Payload with permissions
 */
export interface PermissionJWTPayload extends JWTPayload {
	permissions?: string[];
}

/**
 * Permission context value type
 */
export interface PermissionContextValue {
	permissions: Set<string>;
	hasPermission: (permission: string) => boolean;
	isLoading: boolean;
}

