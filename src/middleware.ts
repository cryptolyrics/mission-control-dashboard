import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/private")) return NextResponse.next();

  const auth = req.headers.get("authorization");
  const expectedUser = process.env.PRIVATE_DASH_USER || "admin";
  const expectedPass = process.env.PRIVATE_DASH_PASSWORD || "changeme";

  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const [user, pass] = decoded.split(":");
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Private Mission Control"' },
  });
}

export const config = {
  matcher: ["/private/:path*"],
};
