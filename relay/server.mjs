import http from 'node:http';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.RELAY_PORT || 8787);
const TOKEN = process.env.RELAY_AUTH_TOKEN || '';
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';
const USAGE_STORE = process.env.USAGE_STORE_PATH || path.join(process.cwd(), 'usage-store.json');

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

function loadUsageStore() {
  try {
    const raw = fs.readFileSync(USAGE_STORE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.agents) return parsed;
  } catch {}
  return { updatedAt: Date.now(), agents: {} };
}

function saveUsageStore(store) {
  fs.writeFileSync(USAGE_STORE, JSON.stringify(store, null, 2));
}

function modelRates(model = '') {
  const m = String(model).toLowerCase();
  if (m.includes('minimax')) return { inRate: 15, outRate: 60 };
  if (m.includes('gpt-5-mini')) return { inRate: 0.25, outRate: 2 };
  if (m.includes('gpt-5')) return { inRate: 1.25, outRate: 10 };
  return { inRate: 0, outRate: 0 };
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
      const recent = status?.sessions?.recent || [];
      const agentIds = (status?.heartbeat?.agents || []).map((a) => a.agentId);

      const store = loadUsageStore();
      const now = Date.now();

      for (const agentId of agentIds) {
        const r = recent.find((x) => x.agentId === agentId);
        const currIn = Number(r?.inputTokens || 0);
        const currOut = Number(r?.outputTokens || 0);
        const model = r?.model || store.agents?.[agentId]?.model || null;
        const { inRate, outRate } = modelRates(model || '');

        const prev = store.agents[agentId] || {
          agentId,
          model,
          lastInputTokens: 0,
          lastOutputTokens: 0,
          cumulativeInputTokens: 0,
          cumulativeOutputTokens: 0,
          cumulativeCostUsd: 0,
          percentUsed: null,
          updatedAt: null,
        };

        const deltaIn = currIn >= (prev.lastInputTokens || 0) ? currIn - (prev.lastInputTokens || 0) : currIn;
        const deltaOut = currOut >= (prev.lastOutputTokens || 0) ? currOut - (prev.lastOutputTokens || 0) : currOut;
        const deltaCost = (deltaIn / 1_000_000) * inRate + (deltaOut / 1_000_000) * outRate;

        store.agents[agentId] = {
          ...prev,
          model,
          lastInputTokens: currIn,
          lastOutputTokens: currOut,
          cumulativeInputTokens: Number(prev.cumulativeInputTokens || 0) + deltaIn,
          cumulativeOutputTokens: Number(prev.cumulativeOutputTokens || 0) + deltaOut,
          cumulativeCostUsd: Number(prev.cumulativeCostUsd || 0) + deltaCost,
          percentUsed: r?.percentUsed ?? prev.percentUsed ?? null,
          updatedAt: r?.updatedAt || now,
        };
      }

      store.updatedAt = now;
      saveUsageStore(store);

      const rows = agentIds.map((agentId) => {
        const a = store.agents[agentId] || { agentId };
        const inputTokens = Number(a.cumulativeInputTokens || 0);
        const outputTokens = Number(a.cumulativeOutputTokens || 0);
        return {
          agentId,
          model: a.model || null,
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          percentUsed: a.percentUsed ?? null,
          updatedAt: a.updatedAt || null,
          estCostUsd: Number(a.cumulativeCostUsd || 0),
        };
      });

      rows.sort((a, b) => b.totalTokens - a.totalTokens);
      return send(res, 200, { ok: true, rows, source: 'relay usage-store.json', storePath: USAGE_STORE, updatedAt: store.updatedAt });
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
