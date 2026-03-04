import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  vi.resetModules();
});

describe("auth session token", () => {
  it("throws when session token missing in non-test env", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.PRIVATE_DASH_SESSION_TOKEN;
    delete process.env.PRIVATE_DASH_SECRET;

    await expect(import("../src/lib/auth")).rejects.toThrow(
      /Missing PRIVATE_DASH_SESSION_TOKEN or PRIVATE_DASH_SECRET/
    );
  });

  it("returns configured session token", async () => {
    process.env.NODE_ENV = "production";
    process.env.PRIVATE_DASH_SESSION_TOKEN = "abc123";

    const mod = await import("../src/lib/auth");
    expect(mod.expectedToken()).toBe("abc123");
  });
});
