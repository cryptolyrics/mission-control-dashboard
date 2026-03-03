import { mcFetch } from "@/lib/mcApi";
import { fallbackPetePayload, normalizePetePayload, type PeteTodayResponse } from "@/lib/pete";

async function fetchJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`upstream_status_${response.status}`);
  return response.json();
}

export async function GET() {
  const fallback = fallbackPetePayload();

  try {
    const directPayloadUrl = process.env.PETE_DAILY_PAYLOAD_URL || "";
    if (directPayloadUrl) {
      const raw = await fetchJson(directPayloadUrl);
      const payload = normalizePetePayload(raw);
      return Response.json({ ok: true, source: "pete_daily_payload_url", payload } satisfies PeteTodayResponse);
    }
  } catch (_error) {
    // fall through to mc API and then local fallback
  }

  try {
    const response = await mcFetch("/scoreboard");
    const raw = await response.json().catch(() => ({}));
    const payload = normalizePetePayload(raw);
    const source = response.ok ? "mc_api_scoreboard" : "fallback";
    return Response.json(
      { ok: response.ok, source, payload, error: response.ok ? undefined : "mc_scoreboard_unavailable" } satisfies PeteTodayResponse,
      { status: 200 },
    );
  } catch (_error) {
    return Response.json(
      { ok: true, source: "fallback", payload: fallback, error: "all_upstreams_unavailable" } satisfies PeteTodayResponse,
      { status: 200 },
    );
  }
}
