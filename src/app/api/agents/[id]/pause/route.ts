import { mcFetch } from "@/lib/mcApi";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const action = body?.action === "resume" ? "resume" : "pause";

  if (action === "resume") {
    const res = await mcFetch(`/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        agentId: params.id,
        text: `Resume request for ${params.id}. Please return to active monitoring.`,
      }),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
    return Response.json(data, { status: res.status });
  }

  const minutes = Number(body?.minutes || 30);
  const res = await mcFetch(`/agents/${encodeURIComponent(params.id)}/pause`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ minutes }),
  });
  const data = await res.json().catch(() => ({ ok: false, error: "bad_upstream_response" }));
  return Response.json(data, { status: res.status });
}
