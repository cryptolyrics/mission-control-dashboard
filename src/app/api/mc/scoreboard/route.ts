import { mcFetch } from "@/lib/mcApi";

export async function GET() {
  const res = await mcFetch("/scoreboard");
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  return Response.json(data, { status: res.status });
}
