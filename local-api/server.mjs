import http from 'http';
import https from 'https';
import { WebSocketServer } from 'ws';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Config
const PORT = parseInt(process.env.MC_API_PORT || '3001');
const HOST = process.env.MC_API_HOST || '127.0.0.1';
const MC_API_KEY = process.env.MC_API_KEY || '';
const OPENCLAW_GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
const OPENCLAW_GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

// Simple auth check
function isAuthed(req) {
  if (!MC_API_KEY) return true; // no key configured = open
  const provided = req.headers['x-mc-key'];
  return provided === MC_API_KEY;
}

// JSON helper
function send(res, code, data) {
  res.writeHead(code, { 
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

// MIME types
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// Routes
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  
  // PUBLIC: /health
  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { ok: true, timestamp: Date.now(), hostname: process.env.HOSTNAME || 'localhost' });
  }

  // PROTECTED: everything else
  if (!isAuthed(req)) {
    return send(res, 401, { ok: false, error: 'unauthorized' });
  }

  // /v1/agents
  if (req.method === 'GET' && url.pathname === '/v1/agents') {
    try {
      // Fetch agents from gateway
      const agents = await fetchAgents();
      return send(res, 200, { ok: true, agents });
    } catch (e) {
      return send(res, 500, { ok: false, error: String(e) });
    }
  }

  // /status
  if (req.method === 'GET' && url.pathname === '/status') {
    return send(res, 200, { ok: true, note: 'stub' });
  }

  // 404
  send(res, 404, { ok: false, error: 'not found' });
});

async function fetchAgents() {
  // Try gateway
  if (OPENCLAW_GATEWAY_URL && OPENCLAW_GATEWAY_TOKEN) {
    try {
      const response = await fetch(`${OPENCLAW_GATEWAY_URL.replace('ws', 'http')}/api/agents`, {
        headers: { 'Authorization': `Bearer ${OPENCLAW_GATEWAY_TOKEN}` }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Gateway fetch failed:', e.message);
    }
  }
  
  // Fallback: scan workspaces
  const workspaceRoot = join(process.env.HOME || '/Users/jjbot', '.openclaw');
  const agents = [];
  const workspaces = ['main', 'vlad', 'ali', 'pete', 'coach', 'scout', 'coppa', 'baby-vlad'];
  
  for (const ws of workspaces) {
    const statusPath = join(workspaceRoot, `workspace-${ws}`, 'STATUS.md');
    if (existsSync(statusPath)) {
      agents.push({ id: ws, workspace: `workspace-${ws}`, hasStatus: true });
    }
  }
  return agents;
}

server.listen(PORT, HOST, () => {
  console.log(`Factory API listening on http://${HOST}:${PORT}`);
  console.log(`MC_API_KEY configured: ${!!MC_API_KEY}`);
  console.log(`Gateway: ${OPENCLAW_GATEWAY_URL}`);
});
