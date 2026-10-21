import { NextResponse } from 'next/server';

// Redirect to login if the PHP session cookie is missing.
// (Real verification happens in the PHP API; this is just a fast UX gate.)
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.cookies.get('Digi Art’s Store_admin')) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };
