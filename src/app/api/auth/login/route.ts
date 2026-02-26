import { NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken, isValidLogin } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const user = body?.user || "";
  const password = body?.password || "";

  if (!isValidLogin(user, password)) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: AUTH_COOKIE,
    value: expectedToken(),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
