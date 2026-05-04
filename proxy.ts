import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasGuestAccess = request.cookies.get("wedding-access")?.value === "1";
  const hasAdminAuth = request.cookies.get("admin-auth")?.value === "1";
  const { pathname } = request.nextUrl;

  // --- Guest routes ---
  if (pathname.startsWith("/welcome") && !hasGuestAccess) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname === "/" && hasGuestAccess) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // --- Admin routes ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !hasAdminAuth) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (pathname.startsWith("/admin/login") && hasAdminAuth) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

export const config = {
  matcher: ["/", "/welcome/:path*", "/admin/:path*", "/admin"],
};
