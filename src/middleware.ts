import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check for auth cookie
    const authCookie = request.cookies.get('adminAuth');

    // If accessing the admin root, redirect unauthenticated users to the public /login
    if (pathname === '/admin') {
      if (!authCookie || authCookie.value !== 'true') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }

    // For all other /admin/* routes, require authentication and redirect to /login if missing
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
