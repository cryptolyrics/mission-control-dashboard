import http from 'node:http';
import os from 'node:os';
import { execFile } from 'node:child_process';

const PORT = Number(process.env.MC_API_PORT || 3001);
const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';
const MC_KEY = process.env.MC_API_KEY || '';
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

function send(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(data));
}

function isAuthed(req) {
  if (!MC_KEY) return true;
  return req.headers['x-mc-key'] === MC_KEY;
}

function gatewayCall(method, params = {}) {
  return new Promise((resolve, reject) => {
    const args = ['gateway', 'call', method, '--params', JSON.stringify(params), '--json', '--url', GATEWAY_URL];
    if (GATEWAY_TOKEN) args.push('--token', GATEWAY_TOKEN);
    execFile(OPENCLAW_BIN, args, { timeout: 20000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      try { resolve(JSON.parse(stdout || '{}')); } catch (e) { reject(e); }
    });
  });
}

function weekStartMs() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}

const server = http.createServer(async (req, res) => {
  if (!isAuthed(req)) return send(res, 401, { ok: false, error: 'unauthorized' });
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, { ok: true, timestamp: Date.now(), hostname: os.hostname() });
    }

    if (req.method === 'GET' && url.pathname === '/agents') {
      const status = await gatewayCall('status', {});
      const heartbeat = status?.heartbeat?.agents || [];
      const recent = status?.sessions?.recent || [];
      const agents = heartbeat.map((a) => {
        const s = recent.find((r) => r.agentId === a.agentId);
        return {
          id: a.agentId,
          enabled: !!a.enabled,
          heartbeatEvery: a.every,
          status: a.enabled ? (s ? 'online' : 'idle') : 'paused',
          model: s?.model || null,
          sessionKey: s?.key || null,
          updatedAt: s?.updatedAt || null,
          percentUsed: s?.percentUsed ?? null,
          inputTokens: s?.inputTokens ?? 0,
          outputTokens: s?.outputTokens ?? 0,
          totalTokens: s?.totalTokens ?? 0,
        };
      });
      return send(res, 200, { ok: true, agents });
    }

    if (req.method === 'GET' && url.pathname === '/scoreboard') {
      const status = await gatewayCall('status', {});
      const recent = status?.sessions?.recent || [];
      const start = weekStartMs();
      const rows = recent
        .filter((r) => Number(r.updatedAt || 0) >= start)
        .map((r) => ({
          agentId: r.agentId,
          model: r.model || null,
          totalTokens: Number(r.totalTokens || 0),
          inputTokens: Number(r.inputTokens || 0),
          outputTokens: Number(r.outputTokens || 0),
          percentUsed: r.percentUsed ?? null,
          updatedAt: r.updatedAt || null,
        }))
        .sort((a, b) => b.totalTokens - a.totalTokens);

      const totals = rows.reduce((acc, r) => {
        acc.inputTokens += r.inputTokens;
        acc.outputTokens += r.outputTokens;
        acc.totalTokens += r.totalTokens;
        return acc;
      }, { inputTokens: 0, outputTokens: 0, totalTokens: 0 });

      return send(res, 200, { ok: true, weekStartMs: start, totals, rows });
    }

    return send(res, 404, { ok: false, error: 'not_found' });
  } catch (e) {
    return send(res, 500, { ok: false, error: String(e.message || e) });
  }
});

server.listen(PORT, () => {
  console.log(`mc-local-api listening on :${PORT}`);
});
