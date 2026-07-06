import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // If there is no token and trying to access a protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists, allow the request to proceed
  return NextResponse.next();
}

// Specify the paths where this middleware should run
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect /dashboard and any sub-routes
    '/settings/:path*',
  ],
};