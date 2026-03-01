import { mcFetch } from "@/lib/mcApi";

export async function GET(_: Request, { params }: { params: { agentId: string } }) {
  const res = await mcFetch(`/logs/${encodeURIComponent(params.agentId)}`);
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  return Response.json(data, { status: res.status });
}
