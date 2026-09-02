/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
}
function apiError(msg: string, status = 400) { return json({ error: msg }, status); }
function genId() { return crypto.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = (Math.random()*16)|0; return (c==='x'?r:(r&0x3|0x8)).toString(16); }); }
function nowIso() { return new Date().toISOString(); }
function safeJsonParse<T>(text: string, fallback: T): T { try { return JSON.parse(text) as T; } catch { return fallback; } }

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$100000$${btoa(String.fromCharCode(...salt))}$${btoa(String.fromCharCode(...new Uint8Array(bits)))}`;
}
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1]);
  const salt = Uint8Array.from(atob(parts[2]), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits))) === parts[3];
}

async function getUser(env: Env, request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const row = await env.DB.prepare('SELECT u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > ?').bind(auth.slice(7), nowIso()).first();
  return row as Record<string, unknown> | null;
}

async function logActivity(env: Env, userId: string, action: string, entityType: string, entityName: string | null) {
  await env.DB.prepare('INSERT INTO activity_logs (id, user_id, action, entity_type, entity_name) VALUES (?, ?, ?, ?, ?)').bind(genId(), userId, action, entityType, entityName).run();
}

const API_BASE = 'https://api.cloudflare.com/client/v4';

async function runDeployment(env: Env, job: { deployment_id: string; worker_name: string; cf_token: string; uuid: string; proxyip?: string; admin_password?: string; origin: string; worker_source?: string }) {
  const { deployment_id, worker_name, cf_token, uuid, proxyip, admin_password, origin, worker_source } = job;
  const headers = { Authorization: `Bearer ${cf_token}` };
  const appendLog = async (line: string) => { const row = await env.DB.prepare('SELECT logs FROM deployments WHERE id = ?').bind(deployment_id).first() as Record<string, unknown> | null; await env.DB.prepare('UPDATE deployments SET logs = ? WHERE id = ?').bind(String(row?.logs ?? '') + line + '\n', deployment_id).run(); };
  const fail = async (msg: string) => { await appendLog('✗ ' + msg); await env.DB.prepare('UPDATE deployments SET status = ?, error_message = ?, updated_at = ? WHERE id = ?').bind('failed', msg, nowIso(), deployment_id).run(); };

  try {
    await appendLog('verifying token...');
    const v = await fetch(`${API_BASE}/user/tokens/verify`, { headers }).then(r => r.json()) as { success?: boolean };
    if (!v.success) return await fail('invalid token');
    await appendLog('✓ token verified');

    const accts = await fetch(`${API_BASE}/accounts?per_page=50`, { headers }).then(r => r.json()) as { result?: Array<{ id: string; name: string }> };
    if (!accts.result?.length) return await fail('no accounts');
    const accountId = accts.result[0].id;
    await appendLog(`✓ account: ${accts.result[0].name}`);

    await appendLog('fetching source...');
    const srcUrl = worker_source === 'proxypanel' ? `${origin}/worker.js` : 'https://raw.githubusercontent.com/cmliu/edgetunnel/main/_worker.js';
    let code = '';
    try { const r = await fetch(srcUrl); if (r.ok) code = await r.text(); } catch {}
    if (!code) return await fail('source fetch failed');
    await appendLog(`✓ source (${code.length} bytes)`);

    await appendLog('creating KV...');
    let kvId = '';
    const kvTitle = `${worker_name}-kv`;
    // First try to find existing KV by listing all pages
    let page = 1;
    let found = false;
    while (!found && page <= 5) {
      const existingList = await fetch(`${API_BASE}/accounts/${accountId}/storage/kv/namespaces?per_page=100&page=${page}`, { headers }).then(r => r.json()) as { result?: Array<{ id: string; title: string }>; result_info?: { has_more?: boolean } };
      const match = existingList.result?.find((n: { id: string; title: string }) => n.title === kvTitle);
      if (match) { kvId = match.id; found = true; }
      if (!existingList.result_info?.has_more) break;
      page++;
    }
    if (found) {
      await appendLog(`✓ reused KV: ${kvId.slice(0,8)}...`);
    } else {
      // Create new KV
      const kv = await fetch(`${API_BASE}/accounts/${accountId}/storage/kv/namespaces`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: kvTitle }) }).then(r => r.json()) as { result?: { id: string }; errors?: Array<{ message: string }> };
      if (kv.result?.id) { kvId = kv.result.id; }
      else return await fail(kv.errors?.[0]?.message ?? 'KV failed');
    }
    await appendLog(`✓ KV: ${kvId.slice(0,8)}...`);
    await env.DB.prepare('UPDATE deployments SET kv_namespace_id = ? WHERE id = ?').bind(kvId, deployment_id).run();

    await fetch(`${API_BASE}/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/config.json`, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ PROXYIP: proxyip || '', UUID: uuid, ADMIN: admin_password || 'admin123' }) });

    await appendLog('deploying...');
    // Build multipart body manually for module worker upload
    const boundary = '----FormBoundary' + crypto.randomUUID().slice(0, 16);
    const metadata = JSON.stringify({ main_module: 'worker.js', bindings: [{ type: 'kv_namespace', name: 'KV', namespace_id: kvId }], vars: { ADMIN: admin_password || 'admin123' }, compatibility_date: '2025-01-01', compatibility_flags: ['nodejs_compat'] });
    const encoder = new TextEncoder();
    const parts: Uint8Array[] = [];
    // metadata part
    parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n`));
    // worker.js part
    parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="worker.js"; filename="worker.js"\r\nContent-Type: application/javascript+module\r\n\r\n`));
    parts.push(encoder.encode(code));
    parts.push(encoder.encode(`\r\n--${boundary}--\r\n`));
    const totalLen = parts.reduce((s, p) => s + p.length, 0);
    const body = new Uint8Array(totalLen);
    let offset = 0;
    for (const p of parts) { body.set(p, offset); offset += p.length; }
    const d = await fetch(`${API_BASE}/accounts/${accountId}/workers/scripts/${worker_name}`, { method: 'PUT', headers: { Authorization: `Bearer ${cf_token}`, 'Content-Type': `multipart/form-data; boundary=${boundary}` }, body }).then(r => r.json()) as { success?: boolean; errors?: Array<{ message: string }> };
    if (!d.success) return await fail(d.errors?.[0]?.message ?? 'deploy failed');
    await appendLog("✓ script uploaded");

    // Enable workers.dev subdomain
    try {
      const sb = "----SB" + crypto.randomUUID().slice(0,8);
      const sBody = JSON.stringify({ workers_dev_enabled: true });
      const sParts = [encoder.encode("--" + sb + "\r\nContent-Disposition: form-data; name=\"settings\"\r\nContent-Type: application/json\r\n\r\n" + sBody + "\r\n--" + sb + "--\r\n")];
      const sTotal = sParts.reduce((a, p) => a + p.length, 0);
      const sForm = new Uint8Array(sTotal); let so = 0; for (const p of sParts) { sForm.set(p, so); so += p.length; }
      await fetch(API_BASE + "/accounts/" + accountId + "/workers/scripts/" + worker_name + "/settings", { method: "PATCH", headers: { Authorization: "Bearer " + cf_token, "Content-Type": "multipart/form-data; boundary=" + sb }, body: sForm });
      await appendLog("✓ workers.dev enabled");
    } catch { await appendLog("! workers.dev enable skipped"); }


    const workerUrl = `https://${worker_name}.${accountId.slice(0,8)}.workers.dev`;
    await appendLog(`✓ deployed: ${workerUrl}`);
    await env.DB.prepare('UPDATE deployments SET status = ?, worker_url = ?, worker_code = ?, updated_at = ? WHERE id = ?').bind('deployed', workerUrl, code.slice(0,500), nowIso(), deployment_id).run();
  } catch (err: unknown) { await fail(err instanceof Error ? err.message : 'unknown'); }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // API routes
    if (path.startsWith('/api/')) {
      const p = path.slice(4) || '/';

      if (p === '/auth/signup' && method === 'POST') {
        const body = (await request.json()) as { email?: string; password?: string };
        if (!body.email || !body.password) return apiError('email and password required');
        if (body.password.length < 6) return apiError('password min 6 chars');
        const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(body.email).first();
        if (exists) return apiError('email already registered');
        const id = genId();
        await env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(id, body.email, await hashPassword(body.password)).run();
        return json({ data: { id, email: body.email } }, 201);
      }

      if (p === '/auth/login' && method === 'POST') {
        const body = (await request.json()) as { email?: string; password?: string };
        if (!body.email || !body.password) return apiError('email and password required');
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(body.email).first() as Record<string, unknown> | null;
        if (!user || !(await verifyPassword(body.password, String(user.password_hash)))) return apiError('invalid credentials');
        const token = genId();
        await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, String(user.id), new Date(Date.now()+7*86400000).toISOString()).run();
        return json({ data: { token, user: { id: String(user.id), email: user.email, role: user.role } } });
      }

      if (p === '/auth/me' && method === 'GET') {
        const u = await getUser(env, request);
        if (!u) return apiError('unauthorized', 401);
        return json({ data: u });
      }

      const user = await getUser(env, request);
      if (!user) return apiError('unauthorized', 401);

      if (p === '/tokens') {
        if (method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM cf_tokens WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all();
          return json({ data: r.results.map(t => ({ ...t, token: String(t.token).slice(0,8)+'...'+String(t.token).slice(-4) })) });
        }
        if (method === 'POST') {
          const body = (await request.json()) as { name?: string; token?: string };
          if (!body.name?.trim() || !body.token?.trim()) return apiError('name and token required');
          const id = genId();
          await env.DB.prepare("INSERT INTO cf_tokens (id, user_id, name, token, status, created_at) VALUES (?, ?, ?, ?, 'active', ?)").bind(id, String(user.id), body.name.trim(), body.token.trim(), nowIso()).run();
          await logActivity(env, String(user.id), 'token_created', 'token', body.name.trim());
          return json({ data: { id, name: body.name.trim(), status: 'active' } }, 201);
        }
      }

      const tokenM = p.match(/^\/tokens\/([^/]+)$/);
      if (tokenM && method === 'DELETE') {
        const row = await env.DB.prepare('DELETE FROM cf_tokens WHERE id = ? AND user_id = ? RETURNING name').bind(tokenM[1], user.id).first() as Record<string, unknown> | null;
        if (!row) return apiError('not found', 404);
        await logActivity(env, String(user.id), 'token_deleted', 'token', String(row.name));
        return json({ success: true });
      }

      if (p === '/deployments') {
        if (method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM deployments WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all();
          return json({ data: r.results.map(d => ({ ...d, config: safeJsonParse(String(d.config||'{}'), {}) })) });
        }
        if (method === 'POST') {
          const body = (await request.json()) as { name?: string; uuid?: string; cf_token_id?: string; proxyip?: string; admin_password?: string; method?: string; worker_source?: string };
          const name = (body.name??'').trim().toLowerCase();
          if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(name)) return apiError('invalid name');
          if (!body.uuid) return apiError('UUID required');
          const tok = await env.DB.prepare("SELECT id, token FROM cf_tokens WHERE id = ? AND user_id = ? AND status = 'active'").bind(body.cf_token_id??'', user.id).first() as Record<string, unknown> | null;
          if (!tok) return apiError('token not found');
          const id = genId();
          await env.DB.prepare("INSERT INTO deployments (id, user_id, name, status, uuid, method, cf_token_row_id, created_at, updated_at) VALUES (?, ?, ?, 'deploying', ?, ?, ?, ?, ?)").bind(id, String(user.id), name, body.uuid, body.method||'workers', tok.id, nowIso(), nowIso()).run();
          await logActivity(env, String(user.id), 'deployment_created', 'deployment', name);
          ctx.waitUntil(runDeployment(env, { deployment_id: id, worker_name: name, cf_token: String(tok.token), uuid: body.uuid, proxyip: body.proxyip, admin_password: body.admin_password, origin: url.origin, worker_source: body.worker_source||'edgetunnel' }));
          const row = await env.DB.prepare('SELECT * FROM deployments WHERE id = ?').bind(id).first();
          return json({ data: row }, 201);
        }
      }

      const depM = p.match(/^\/deployments\/([^/]+)$/);
      if (depM && method === 'DELETE') {
        const row = await env.DB.prepare('DELETE FROM deployments WHERE id = ? AND user_id = ? RETURNING name').bind(depM[1], user.id).first() as Record<string, unknown> | null;
        if (!row) return apiError('not found', 404);
        await logActivity(env, String(user.id), 'deployment_deleted', 'deployment', String(row.name));
        return json({ success: true });
      }

      const memLM = p.match(/^\/deployments\/([^/]+)\/members$/);
      if (memLM) {
        const depId = memLM[1];
        const dep = await env.DB.prepare('SELECT id FROM deployments WHERE id = ? AND user_id = ?').bind(depId, user.id).first();
        if (!dep) return apiError('not found', 404);
        if (method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM worker_members WHERE deployment_id = ? ORDER BY created_at DESC').bind(depId).all();
          return json({ data: r.results.map(m => ({ ...m, enabled: !!m.enabled, settings: safeJsonParse(String(m.settings||'{}'), {}) })) });
        }
        if (method === 'POST') {
          const body = (await request.json()) as { name?: string; expires_at?: string; quota_bytes?: number; request_quota?: number; ip_limit?: number };
          if (!body.name?.trim()) return apiError('name required');
          const id = genId(); const token = genId();
          await env.DB.prepare('INSERT INTO worker_members (id, owner_user_id, deployment_id, name, token, enabled, expires_at, quota_bytes, request_quota, ip_limit) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)').bind(id, String(user.id), depId, body.name.trim(), token, body.expires_at||null, body.quota_bytes||null, body.request_quota||null, body.ip_limit||null).run();
          await logActivity(env, String(user.id), 'member_created', 'member', body.name.trim());
          const row = await env.DB.prepare('SELECT * FROM worker_members WHERE id = ?').bind(id).first();
          return json({ data: row }, 201);
        }
      }

      const memM = p.match(/^\/deployments\/([^/]+)\/members\/([^/]+)$/);
      if (memM) {
        const depId = memM[1], memId = memM[2];
        const dep = await env.DB.prepare('SELECT id FROM deployments WHERE id = ? AND user_id = ?').bind(depId, user.id).first();
        if (!dep) return apiError('not found', 404);
        if (method === 'PATCH') {
          const body = (await request.json()) as Record<string, unknown>;
          const sets: string[] = []; const binds: unknown[] = [];
          for (const [k,v] of Object.entries(body)) { if (['enabled','expires_at','quota_bytes','request_quota','ip_limit','name'].includes(k)) { sets.push(`${k} = ?`); binds.push(k==='enabled'?(v?1:0):v); } }
          if (!sets.length) return apiError('no changes');
          binds.push(memId, depId);
          await env.DB.prepare(`UPDATE worker_members SET ${sets.join(', ')} WHERE id = ? AND deployment_id = ?`).bind(...binds).run();
          return json({ data: await env.DB.prepare('SELECT * FROM worker_members WHERE id = ?').bind(memId).first() });
        }
        if (method === 'DELETE') {
          const row = await env.DB.prepare('DELETE FROM worker_members WHERE id = ? AND deployment_id = ? RETURNING name').bind(memId, depId).first() as Record<string, unknown> | null;
          if (!row) return apiError('not found', 404);
          await logActivity(env, String(user.id), 'member_deleted', 'member', String(row.name));
          return json({ success: true });
        }
      }

      if (p === '/activity' && method === 'GET') {
        const r = await env.DB.prepare('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').bind(user.id).all();
        return json({ data: r.results });
      }

      return apiError('not found', 404);
    }

    // Non-API → serve frontend
    return env.ASSETS.fetch(request);
  },
};
