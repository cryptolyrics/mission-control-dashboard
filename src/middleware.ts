import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "mc_priv";
const PROTECTED_PAGES = ["/private", "/agents", "/tasks", "/coach", "/analytics", "/settings"];

function needsPageAuth(pathname: string) {
  return PROTECTED_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function needsApiAuth(pathname: string) {
  if (!pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/api/auth/")) return false;
  return true;
}

function expectedToken() {
  return process.env.PRIVATE_DASH_SESSION_TOKEN || process.env.PRIVATE_DASH_SECRET || "dev-session-token";
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!needsPageAuth(pathname) && !needsApiAuth(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token && token === expectedToken()) return NextResponse.next();

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
