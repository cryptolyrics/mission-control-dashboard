import { mcFetch } from "@/lib/mcApi";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const res = await mcFetch(`/runs/execute`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  return Response.json(data, { status: res.status });
}
