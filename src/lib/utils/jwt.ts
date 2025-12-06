'use client';

import { decodeJwt } from 'jose';
import { PermissionJWTPayload } from '@/types/permissions.types';

/**
 * Decode JWT token payload
 * Client-side only - does not verify signature
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeToken(token: string): PermissionJWTPayload | null {
	try {
		const decoded = decodeJwt(token) as PermissionJWTPayload;
		return decoded;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('[JWT Decode Error]', error);
		}
		return null;
	}
}

/**
 * Get token from cookie (client-side only)
 * @returns Token string or null
 */
export function getTokenFromCookie(): string | null {
	if (typeof document === 'undefined') {
		return null;
	}

	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === 'token' && value) {
			return decodeURIComponent(value);
		}
	}

	return null;
}

