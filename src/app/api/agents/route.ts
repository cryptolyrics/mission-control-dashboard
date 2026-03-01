import { mcFetch } from "@/lib/mcApi";

export async function GET() {
  const res = await mcFetch("/agents");
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  if (Array.isArray(data?.agents)) {
    return Response.json({ ok: true, agents: data.agents, ts: data.ts ?? null }, { status: res.status });
  }
  return Response.json(data, { status: res.status });
}
