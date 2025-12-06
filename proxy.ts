import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy for route protection and authentication
 * Handles authentication checks and redirects at the network boundary
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // API routes should not be redirected
  const isApiRoute = pathname.startsWith('/api');
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Matcher configuration for proxy
 * Exclude static files, images, and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
