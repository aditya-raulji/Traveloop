import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const { pathname, search } = request.nextUrl;
  const isAuth = !!token;

  const protectedRoutes = ['/dashboard', '/trips', '/profile', '/community', '/admin'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/signup'];
  const isAdminPage = pathname.startsWith('/admin');

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 1. Handle Auth Pages (Login/Register)
  if (isAuthRoute) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Handle Protected Routes
  if (isProtectedRoute) {
    if (!isAuth) {
      let from = pathname;
      if (search) from += search;
      
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', from);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Handle Admin Protection
    if (isAdminPage && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
