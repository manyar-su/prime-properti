import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/security/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/agent") && pathname !== "/agent/login") {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL("/agent/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agent/:path*"],
};

