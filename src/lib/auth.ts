import crypto from "crypto";
import bcrypt from "bcryptjs";

export const AUTH_COOKIE = "mc_priv";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function expectedUser() {
  return process.env.PRIVATE_DASH_USER || "admin";
}

export function expectedPasswordHash() {
  return process.env.PRIVATE_DASH_PASSWORD_HASH || "";
}

export function expectedToken() {
  const secret = process.env.PRIVATE_DASH_SECRET || process.env.PRIVATE_DASH_PASSWORD_HASH || "";
  return crypto.createHash("sha256").update(`mc:${secret}`).digest("hex");
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
