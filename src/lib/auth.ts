import crypto from "crypto";

export const AUTH_COOKIE = "mc_priv";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function expectedPassword() {
  return process.env.PRIVATE_DASH_PASSWORD || "changeme";
}

export function expectedUser() {
  return process.env.PRIVATE_DASH_USER || "admin";
}

export function expectedToken() {
  const secret = process.env.PRIVATE_DASH_SECRET || process.env.PRIVATE_DASH_PASSWORD || "changeme";
  return crypto.createHash("sha256").update(`mc:${secret}`).digest("hex");
}

export function isValidLogin(user: string, password: string) {
  return safeEqual(user || "", expectedUser()) && safeEqual(password || "", expectedPassword());
}

export function isValidToken(token?: string) {
  if (!token) return false;
  return safeEqual(token, expectedToken());
}
