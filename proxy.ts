import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, ADMIN_SESSION_COOKIE } from "@/lib/constants";

const PROTECTED_PREFIXES = ["/dashboard", "/course", "/certificate", "/shop", "/give"];

/**
 * Optimistic redirect only — presence of the cookie, not its validity. Real
 * verification (DB-backed session lookup) happens in requireUser()/requireAdmin(),
 * called from the respective layouts and every Server Action that mutates data.
 *
 * The admin credential system (ADMIN_SESSION_COOKIE) is entirely separate from
 * the course-taking user system (SESSION_COOKIE) — neither cookie grants the
 * other's access.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const hasAdminCookie = request.cookies.has(ADMIN_SESSION_COOKIE);

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (hasAdminCookie) return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.next();
    }
    if (!hasAdminCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/course/:path*",
    "/certificate/:path*",
    "/shop/:path*",
    "/give/:path*",
    "/login",
    "/admin/:path*",
  ],
};
