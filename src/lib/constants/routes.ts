export const ROUTES = {
  HOME: '/',

  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },

  DASHBOARD: {
    HOME: '/dashboard',
    USERS: {
      LIST: '/dashboard/users',
      DETAIL: (id: string) => `/dashboard/users/${id}`,
      CREATE: '/dashboard/users/new',
      EDIT: (id: string) => `/dashboard/users/${id}/edit`,
    },
  },

  API: {
    BASE: '/api',
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me',
    },
    USERS: {
      LIST: '/api/users',
      DETAIL: (id: string) => `/api/users/${id}`,
    },
  },
} as const;

export type Routes = typeof ROUTES;
