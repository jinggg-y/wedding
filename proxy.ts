import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasAccess = request.cookies.get("wedding-access")?.value === "1";
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated guests away from protected pages
  if (pathname.startsWith("/welcome") && !hasAccess) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Skip the landing page if already authenticated
  if (pathname === "/" && hasAccess) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }
}

export const config = {
  matcher: ["/", "/welcome/:path*"],
};
