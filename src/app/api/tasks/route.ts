import { relayFetch } from "@/lib/relay";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const res = await relayFetch("/tasks", { method: "POST", body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({ ok: false, error: "bad_relay_response" }));
  return Response.json(data, { status: res.status });
}
