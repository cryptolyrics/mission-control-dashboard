import { relayFetch } from "@/lib/relay";

export async function GET() {
  const res = await relayFetch("/agents");
  const data = await res.json().catch(() => ({ ok: false, error: "bad_relay_response" }));
  return Response.json(data, { status: res.status });
}
