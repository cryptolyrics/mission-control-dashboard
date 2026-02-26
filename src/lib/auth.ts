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

export function expectedPasswordPlain() {
  return process.env.PRIVATE_DASH_PASSWORD || "";
}

export function expectedToken() {
  return process.env.PRIVATE_DASH_SESSION_TOKEN || process.env.PRIVATE_DASH_SECRET || "dev-session-token";
}

export async function isValidLogin(user: string, password: string) {
  const userOk = safeEqual(user || "", expectedUser());
  if (!userOk) return false;

  const hash = expectedPasswordHash();
  if (hash) return bcrypt.compare(password || "", hash);

  const plain = expectedPasswordPlain();
  if (plain) return safeEqual(password || "", plain);

  return false;
}

export function isValidToken(token?: string) {
  if (!token) return false;
  return safeEqual(token, expectedToken());
}
