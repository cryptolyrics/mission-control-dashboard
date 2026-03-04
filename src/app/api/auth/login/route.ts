import { NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken, isValidLogin } from "@/lib/auth";

export const runtime = "nodejs";

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  attempts.set(ip, entry);
  return { allowed: true, retryAfter: 0 };
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const body = await req.json().catch(() => null);
  const user = body?.user || "";
  const password = body?.password || "";

  if (!(await isValidLogin(user, password))) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  attempts.delete(ip);

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
