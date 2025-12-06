import { ROUTES } from '@/lib/constants';
import { redirect } from 'next/navigation';

/**
 * Root page - redirects to dashboard
 * Proxy will handle authentication and redirect to login if needed
 */
export default function Home() {
  redirect(ROUTES.DASHBOARD.HOME);
}
