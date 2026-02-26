import http from 'node:http';
import { execFile } from 'node:child_process';

const PORT = Number(process.env.RELAY_PORT || 8787);
const TOKEN = process.env.RELAY_AUTH_TOKEN || '';
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

function send(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

function authed(req) {
  if (!TOKEN) return true;
  return req.headers['x-relay-token'] === TOKEN;
}

function gatewayCall(method, params = {}) {
  return new Promise((resolve, reject) => {
    execFile(OPENCLAW_BIN, ['gateway', 'call', method, '--params', JSON.stringify(params), '--json'], { timeout: 20000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      try {
        resolve(JSON.parse(stdout || '{}'));
      } catch (e) {
        reject(new Error(`Invalid JSON from gateway: ${String(e)}`));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (!authed(req)) return send(res, 401, { ok: false, error: 'unauthorized' });
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  try {
    if (req.method === 'GET' && url.pathname === '/agents') {
      const status = await gatewayCall('status', {});
      const recent = status?.sessions?.recent || [];
      const heartbeat = status?.heartbeat?.agents || [];
      const agents = heartbeat.map((a) => {
        const s = recent.find((r) => r.agentId === a.agentId);
        return {
          id: a.agentId,
          status: a.enabled ? (s ? 'online' : 'idle') : 'paused',
          heartbeatEvery: a.every,
          sessionKey: s?.key || null,
          model: s?.model || null,
          updatedAt: s?.updatedAt || null,
          percentUsed: s?.percentUsed ?? null,
        };
      });
      return send(res, 200, { ok: true, agents });
    }

    if (req.method === 'GET' && url.pathname === '/usage') {
      const status = await gatewayCall('status', {});
      const rows = (status?.sessions?.recent || []).map((r) => {
        const model = String(r.model || '');
        const inTok = Number(r.inputTokens || 0);
        const outTok = Number(r.outputTokens || 0);
        let inRate = 0;
        let outRate = 0;
        if (model.toLowerCase().includes('minimax')) { inRate = 15; outRate = 60; }
        else if (model.toLowerCase().includes('gpt-5-mini')) { inRate = 0.25; outRate = 2; }
        else if (model.toLowerCase().includes('gpt-5')) { inRate = 1.25; outRate = 10; }
        const estCostUsd = (inTok / 1_000_000) * inRate + (outTok / 1_000_000) * outRate;
        return {
          agentId: r.agentId,
          model: r.model || null,
          inputTokens: inTok,
          outputTokens: outTok,
          totalTokens: Number(r.totalTokens || inTok + outTok),
          percentUsed: r.percentUsed ?? null,
          updatedAt: r.updatedAt || null,
          estCostUsd,
        };
      });
      rows.sort((a, b) => b.totalTokens - a.totalTokens);
      return send(res, 200, { ok: true, rows, source: 'openclaw gateway call status' });
    }

    const pauseMatch = url.pathname.match(/^\/agents\/([^/]+)\/pause$/);
    if (req.method === 'POST' && pauseMatch) {
      const agentId = decodeURIComponent(pauseMatch[1]);
      const body = await parseBody(req);
      const minutes = Number(body.minutes || 30);
      const at = new Date(Date.now() + 5 * 1000).toISOString();
      const job = await gatewayCall('cron.add', {
        job: {
          name: `pause-${agentId}-${Date.now()}`,
          schedule: { kind: 'at', at },
          sessionTarget: 'main',
          payload: {
            kind: 'systemEvent',
            text: `Pause request for ${agentId}: stop active work and remain idle for ${minutes} minutes unless overridden.`,
          },
        },
      });
      return send(res, 200, { ok: true, mode: 'soft-pause', job });
    }

    const logsMatch = url.pathname.match(/^\/agents\/([^/]+)\/logs$/);
    if (req.method === 'GET' && logsMatch) {
      const agentId = decodeURIComponent(logsMatch[1]);
      const raw = await gatewayCall('logs.tail', {});
      const lines = (raw?.lines || []).filter((l) => typeof l === 'string' && l.includes(`agent:${agentId}:`)).slice(-200);
      return send(res, 200, { ok: true, agentId, lines, cursor: raw?.cursor || null });
    }

    if (req.method === 'POST' && url.pathname === '/tasks') {
      const body = await parseBody(req);
      const agentId = body.agentId || 'main';
      const text = body.text || body.message;
      if (!text) return send(res, 400, { ok: false, error: 'text required' });

      const at = new Date(Date.now() + 5 * 1000).toISOString();
      const job = await gatewayCall('cron.add', {
        job: {
          name: `task-${agentId}-${Date.now()}`,
          schedule: { kind: 'at', at },
          sessionTarget: 'main',
          payload: {
            kind: 'systemEvent',
            text: `[Dashboard task for ${agentId}] ${text}`,
          },
        },
      });
      return send(res, 200, { ok: true, jobId: job?.id || null, job });
    }

    return send(res, 404, { ok: false, error: 'not_found' });
  } catch (e) {
    return send(res, 500, { ok: false, error: String(e.message || e) });
  }
});

server.listen(PORT, () => {
  console.log(`relay listening on :${PORT}`);
});
