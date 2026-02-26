import { relayFetch } from "@/lib/relay";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await relayFetch(`/agents/${encodeURIComponent(params.id)}/logs`);
  const data = await res.json().catch(() => ({ ok: false, error: "bad_relay_response" }));
  return Response.json(data, { status: res.status });
}
