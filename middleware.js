import { NextResponse } from "next/server";

// Session cookies are httpOnly: only this server-side check (and the API) can see them.
// Presence is enough here; the API verifies the token on every request.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isPublic = pathname.startsWith("/admin/login") || /^\/admin\/(apple-)?icon/.test(pathname);
    if (!isPublic && !request.cookies.get("admin_token")?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (pathname.startsWith("/account") && !request.cookies.get("customer_token")?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
