import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

const PROTECTED = ["/private", "/agents", "/tasks", "/coach", "/analytics", "/settings"];

function needsAuth(pathname: string) {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!needsAuth(pathname)) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (isValidToken(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/private/:path*", "/agents/:path*", "/tasks/:path*", "/coach/:path*", "/analytics/:path*", "/settings/:path*"],
};
