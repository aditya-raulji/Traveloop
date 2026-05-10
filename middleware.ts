import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
    }

    if (isAdminPage && req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return null;
  },
  {
    callbacks: {
      // Allow the middleware function to run for all paths
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/trips/:path*', '/community/:path*', '/admin/:path*', '/login', '/signup'],
};
