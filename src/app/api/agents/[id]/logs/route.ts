import { mcFetch } from "@/lib/mcApi";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await mcFetch(`/agents/${encodeURIComponent(params.id)}/logs`);
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  if (data?.ok && Array.isArray(data.lines)) {
    return Response.json({ ok: true, logs: data.lines }, { status: res.status });
  }
  return Response.json(data, { status: res.status });
}
