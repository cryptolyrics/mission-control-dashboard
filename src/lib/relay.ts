const RELAY_URL = process.env.RELAY_BASE_URL || "";
const RELAY_TOKEN = process.env.RELAY_AUTH_TOKEN || "";

export async function relayFetch(path: string, init?: RequestInit) {
  if (!RELAY_URL) {
    return new Response(JSON.stringify({ ok: false, error: "RELAY_BASE_URL not set" }), { status: 500 });
  }

  const res = await fetch(`${RELAY_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-relay-token": RELAY_TOKEN,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}
