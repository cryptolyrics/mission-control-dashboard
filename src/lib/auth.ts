import bcrypt from "bcryptjs";

export const AUTH_COOKIE = "mc_priv";

function safeEqual(a: string, b: string) {
  return a.length === b.length && a === b;
}

export function expectedUser() {
  return process.env.PRIVATE_DASH_USER || "admin";
}

export function expectedPasswordHash() {
  return process.env.PRIVATE_DASH_PASSWORD_HASH || "";
}

export function expectedToken() {
  return process.env.PRIVATE_DASH_SESSION_TOKEN || process.env.PRIVATE_DASH_SECRET || "dev-session-token";
}

export async function isValidLogin(user: string, password: string) {
  const hash = expectedPasswordHash();
  if (!hash) return false;
  const userOk = safeEqual(user || "", expectedUser());
  if (!userOk) return false;
  return bcrypt.compare(password || "", hash);
}

export function isValidToken(token?: string) {
  if (!token) return false;
  return safeEqual(token, expectedToken());
}
