import { mcFetch } from "@/lib/mcApi";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await mcFetch(`/logs/${encodeURIComponent(params.id)}`);
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  return Response.json(data, { status: res.status });
}
