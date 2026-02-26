# Mission Control Local API (Cloudflare Tunnel)

Runs on your Mac and exposes a minimal API for the dashboard.

## Endpoints
- `GET /health` -> `{ ok, timestamp, hostname }`
- `GET /agents` -> live agent list from OpenClaw gateway
- `GET /scoreboard` -> weekly token scoreboard summary

All endpoints require header: `X-MC-KEY` (if `MC_API_KEY` is set).

## Run

```bash
cd local-api
MC_API_PORT=3001 \
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789 \
OPENCLAW_GATEWAY_TOKEN=<gateway-token-if-needed> \
MC_API_KEY=<shared-secret> \
node server.mjs
```

## Cloudflare Tunnel
Expose `http://localhost:3001` with tunnel and use that public URL as Vercel env:

- `MC_API_BASE_URL=https://<your-tunnel-domain>`
- `MC_API_KEY=<same shared secret>`

Dashboard proxies through Next.js routes:
- `/api/mc/health`
- `/api/mc/agents`
- `/api/mc/scoreboard`
