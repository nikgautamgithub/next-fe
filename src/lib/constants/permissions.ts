/**
 * Permission constants
 * Format: resource:action
 * Clean, type-safe permission strings
 */
export const PERMISSIONS = {
  USERS: {
    READ: 'users:read',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  DASHBOARD: {
    VIEW: 'dashboard:view',
  },
  APTITUDE: {
    VIEW: 'aptitude:view',
    CREATE: 'aptitude:create',
    VIEW_REPORT: 'aptitude:view_report',
  },
} as const;
