export const APP_CONFIG = {
  name: 'Recruiter App',
  description: 'Production-grade Next.js frontend',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export const API_CONFIG = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const;
