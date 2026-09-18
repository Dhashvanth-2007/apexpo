import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "apexpo_production_jwt_secret_key_change_in_production_2027";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const AUTH_COOKIE = "apexpo_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, secretKey);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // Unauthenticated user trying to access protected admin page
    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Already authenticated user visiting login page -> redirect to dashboard
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
