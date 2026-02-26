const BASE = process.env.MC_API_BASE_URL || "";
const KEY = process.env.MC_API_KEY || "";

export async function mcFetch(path: string) {
  if (!BASE) {
    return new Response(JSON.stringify({ ok: false, error: "MC_API_BASE_URL not set" }), { status: 500 });
  }
  return fetch(`${BASE}${path}`, {
    headers: {
      "x-mc-key": KEY,
    },
    cache: "no-store",
  });
}
