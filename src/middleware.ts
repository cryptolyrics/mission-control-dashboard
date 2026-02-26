import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

const PROTECTED_PAGES = ["/private", "/agents", "/tasks", "/coach", "/analytics", "/settings"];

function needsPageAuth(pathname: string) {
  return PROTECTED_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function needsApiAuth(pathname: string) {
  if (!pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/api/auth/")) return false;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!needsPageAuth(pathname) && !needsApiAuth(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (isValidToken(token)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/private/:path*",
    "/agents/:path*",
    "/tasks/:path*",
    "/coach/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
