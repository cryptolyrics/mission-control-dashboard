import bcrypt from "bcryptjs";

export const AUTH_COOKIE = "mc_priv";

function safeEqual(a: string, b: string) {
  return a.length === b.length && a === b;
}

function cleanEnv(v?: string) {
  if (!v) return "";
  const trimmed = v.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function expectedUser() {
  return cleanEnv(process.env.PRIVATE_DASH_USER) || "admin";
}

export function expectedPasswordHash() {
  return cleanEnv(process.env.PRIVATE_DASH_PASSWORD_HASH);
}

export function expectedPasswordPlain() {
  return cleanEnv(process.env.PRIVATE_DASH_PASSWORD);
}

const SESSION_TOKEN = cleanEnv(process.env.PRIVATE_DASH_SESSION_TOKEN || process.env.PRIVATE_DASH_SECRET);
const REQUIRE_SESSION_TOKEN = process.env.NODE_ENV !== "test";
if (REQUIRE_SESSION_TOKEN && !SESSION_TOKEN) {
  throw new Error("Missing PRIVATE_DASH_SESSION_TOKEN or PRIVATE_DASH_SECRET");
}

export function expectedToken() {
  return SESSION_TOKEN;
}

export async function isValidLogin(user: string, password: string) {
  const userOk = safeEqual((user || "").trim(), expectedUser());
  if (!userOk) return false;

  const incoming = (password || "").trim();
  const hash = expectedPasswordHash();
  if (hash) {
    // If hash env was accidentally set to plain text, allow comparison for recovery.
    if (!hash.startsWith("$2a$") && !hash.startsWith("$2b$") && !hash.startsWith("$2y$")) {
      return safeEqual(incoming, hash);
    }
    return bcrypt.compare(incoming, hash);
  }

  const plain = expectedPasswordPlain();
  if (plain) return safeEqual(incoming, plain);

  return false;
}

export function isValidToken(token?: string) {
  if (!token) return false;
  return safeEqual(token, expectedToken());
}
