# Mission Control Relay

Local relay that bridges Vercel -> OpenClaw Gateway (`localhost:18789`) using `openclaw gateway call`.

## Run locally

```bash
cd relay
RELAY_AUTH_TOKEN=change-me RELAY_PORT=8787 node server.mjs
```

## Exposed endpoints

- `GET /agents`
- `POST /agents/:id/pause`
- `GET /agents/:id/logs`
- `POST /tasks`
- `GET /usage`

All require header: `x-relay-token: <RELAY_AUTH_TOKEN>` (if token is set).

Usage persistence:
- Relay writes per-agent cumulative usage to `usage-store.json` in relay dir.
- Override path with `USAGE_STORE_PATH=/absolute/path/usage-store.json`.

## Vercel env vars

- `RELAY_BASE_URL=https://<your-relay-host>`
- `RELAY_AUTH_TOKEN=<same-token-as-relay>`

## Notes

- `pause` is currently a **soft pause** (creates a system-event task instructing the agent to pause).
- `tasks` currently create one-shot system events via cron.
