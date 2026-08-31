// Cloudflare Pages Function - API handler
// No wrangler.toml needed, no secrets needed
// Just connect repo to Cloudflare Pages in dashboard

interface Env {
  DB: D1Database;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}

function apiError(msg: string, status = 400) {
  return json({ error: msg }, status);
}

function genId() {
  return crypto.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

// ── Password Hashing (PBKDF2) ──────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$100000$${btoa(String.fromCharCode(...salt))}$${btoa(String.fromCharCode(...new Uint8Array(bits)))}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const salt = Uint8Array.from(atob(parts[1]), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: parseInt(parts[1]), hash: 'SHA-256' }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits))) === parts[3];
}

// ── Auth ────────────────────────────────────────────────────────────────────
async function getUser(env: Env, request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return await env.DB.prepare('SELECT u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > ?')
    .bind(token, nowIso())
    .first<{ id: string; email: string; role: string }>();
}

async function logActivity(env: Env, userId: string, action: string, entityType: string, entityName: string | null) {
  await env.DB.prepare('INSERT INTO activity_logs (id, user_id, action, entity_type, entity_name) VALUES (?, ?, ?, ?, ?)')
    .bind(genId(), userId, action, entityType, entityName)
    .run();
}

// ── Deploy Worker via CF API ────────────────────────────────────────────────
const API_BASE = 'https://api.cloudflare.com/client/v4';

async function runDeployment(env: Env, job: {
  deployment_id: string; worker_name: string; cf_token: string; uuid: string;
  proxyip?: string; admin_password?: string; origin: string; worker_source?: string;
}) {
  const { deployment_id, worker_name, cf_token, uuid, proxyip, admin_password, origin, worker_source } = job;
  const headers = { Authorization: `Bearer ${cf_token}` };

  const appendLog = async (line: string) => {
    const row = await env.DB.prepare('SELECT logs FROM deployments WHERE id = ?').bind(deployment_id).first<{ logs: string | null }>();
    await env.DB.prepare('UPDATE deployments SET logs = ? WHERE id = ?').bind((row?.logs ?? '') + line + '\n', deployment_id).run();
  };
  const fail = async (msg: string) => {
    await appendLog('✗ ' + msg);
    await env.DB.prepare('UPDATE deployments SET status = ?, error_message = ?, updated_at = ? WHERE id = ?').bind('failed', msg, nowIso(), deployment_id).run();
  };

  try {
    await appendLog('verifying token...');
    const verifyResp = await fetch(`${API_BASE}/user/tokens/verify`, { headers });
    const verifyData = (await verifyResp.json()) as { success?: boolean };
    if (!verifyData.success) return await fail('invalid cloudflare token');
    await appendLog('✓ token verified');

    const accountsResp = await fetch(`${API_BASE}/accounts?per_page=50`, { headers });
    const accountsData = (await accountsResp.json()) as { success?: boolean; result?: Array<{ id: string; name: string }> };
    if (!accountsData.success || !accountsData.result?.length) return await fail('no cloudflare accounts found');
    const accountId = accountsData.result[0].id;
    await appendLog(`✓ account: ${accountsData.result[0].name}`);

    await appendLog('fetching worker source...');
    let workerCode = '';
    const sourceUrl = worker_source === 'proxypanel'
      ? `${origin}/worker.js`
      : 'https://raw.githubusercontent.com/cmliu/edgetunnel/main/_worker.js';
    try {
      const resp = await fetch(sourceUrl);
      if (resp.ok) workerCode = await resp.text();
    } catch {}
    if (!workerCode) return await fail('failed to fetch worker source');
    await appendLog(`✓ source fetched (${workerCode.length} bytes)`);

    await appendLog('creating KV namespace...');
    const kvResp = await fetch(`${API_BASE}/accounts/${accountId}/storage/kv/namespaces`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `${worker_name}-kv` }),
    });
    const kvData = (await kvResp.json()) as { success?: boolean; result?: { id: string }; errors?: Array<{ message: string }> };
    if (!kvData.success) return await fail(kvData.errors?.[0]?.message ?? 'failed to create KV');
    const kvId = kvData.result!.id;
    await appendLog(`✓ KV created: ${kvId.slice(0, 8)}...`);
    await env.DB.prepare('UPDATE deployments SET kv_namespace_id = ? WHERE id = ?').bind(kvId, deployment_id).run();

    const config = { PROXYIP: proxyip || '', UUID: uuid, ADMIN: admin_password || 'admin123' };
    await fetch(`${API_BASE}/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/config.json`, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    await appendLog('deploying worker...');
    const deployResp = await fetch(`${API_BASE}/accounts/${accountId}/workers/scripts/${worker_name}`, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/javascript+module' },
      body: workerCode,
    });
    const deployData = (await deployResp.json()) as { success?: boolean; errors?: Array<{ message: string }> };
    if (!deployData.success) return await fail(deployData.errors?.[0]?.message ?? 'deploy failed');

    await fetch(`${API_BASE}/accounts/${accountId}/workers/scripts/${worker_name}/bindings`, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ kv_namespaces: [{ binding: 'KV', id: kvId }] }),
    });

    const workerUrl = `https://${worker_name}.${accountId.slice(0, 8)}.workers.dev`;
    await appendLog(`✓ deployed: ${workerUrl}`);
    await env.DB.prepare('UPDATE deployments SET status = ?, worker_url = ?, worker_code = ?, updated_at = ? WHERE id = ?')
      .bind('deployed', workerUrl, workerCode.slice(0, 500), nowIso(), deployment_id).run();
  } catch (err: unknown) {
    await fail(err instanceof Error ? err.message : 'unknown error');
  }
}

// ── Main Handler ────────────────────────────────────────────────────────────
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next, functionPath } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = request.method;

  // Auth routes
  if (path === '/auth/signup' && method === 'POST') {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) return apiError('email and password required');
    if (body.password.length < 6) return apiError('password must be at least 6 characters');
    const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(body.email).first();
    if (exists) return apiError('email already registered');
    const id = genId();
    const hash = await hashPassword(body.password);
    await env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(id, body.email, hash).run();
    return json({ data: { id, email: body.email } }, 201);
  }

  if (path === '/auth/login' && method === 'POST') {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) return apiError('email and password required');
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(body.email)
      .first<{ id: string; email: string; password_hash: string; role: string }>();
    if (!user) return apiError('invalid email or password');
    if (!(await verifyPassword(body.password, user.password_hash))) return apiError('invalid email or password');
    const token = genId();
    const expires = new Date(Date.now() + 7 * 86400000).toISOString();
    await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, user.id, expires).run();
    return json({ data: { token, user: { id: user.id, email: user.email, role: user.role } } });
  }

  if (path === '/auth/me' && method === 'GET') {
    const user = await getUser(env, request);
    if (!user) return apiError('unauthorized', 401);
    return json({ data: user });
  }

  // All routes below require auth
  const user = await getUser(env, request);
  if (!user) return apiError('unauthorized', 401);

  // Tokens
  if (path === '/tokens') {
    if (method === 'GET') {
      const r = await env.DB.prepare('SELECT * FROM cf_tokens WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all();
      return json({ data: r.results.map((t: Record<string, unknown>) => ({ ...t, token: String(t.token).slice(0, 8) + '...' + String(t.token).slice(-4) })) });
    }
    if (method === 'POST') {
      const body = (await request.json()) as { name?: string; token?: string };
      if (!body.name?.trim() || !body.token?.trim()) return apiError('name and token required');
      const id = genId();
      await env.DB.prepare("INSERT INTO cf_tokens (id, user_id, name, token, status, created_at) VALUES (?, ?, ?, ?, 'active', ?)")
        .bind(id, user.id, body.name.trim(), body.token.trim(), nowIso()).run();
      await logActivity(env, user.id, 'token_created', 'token', body.name.trim());
      return json({ data: { id, name: body.name.trim(), status: 'active' } }, 201);
    }
  }

  const tokenMatch = path.match(/^\/tokens\/([^/]+)$/);
  if (tokenMatch && method === 'DELETE') {
    const row = await env.DB.prepare('DELETE FROM cf_tokens WHERE id = ? AND user_id = ? RETURNING name').bind(tokenMatch[1], user.id).first<{ name: string }>();
    if (!row) return apiError('token not found', 404);
    await logActivity(env, user.id, 'token_deleted', 'token', row.name);
    return json({ success: true });
  }

  // Deployments
  if (path === '/deployments') {
    if (method === 'GET') {
      const r = await env.DB.prepare('SELECT * FROM deployments WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all();
      return json({ data: r.results.map((d: Record<string, unknown>) => ({ ...d, config: safeJsonParse(String(d.config || '{}'), {}) })) });
    }
    if (method === 'POST') {
      const body = (await request.json()) as { name?: string; uuid?: string; cf_token_id?: string; proxyip?: string; admin_password?: string; method?: string; worker_source?: string };
      const name = (body.name ?? '').trim().toLowerCase();
      const uuid = (body.uuid ?? '').trim();
      if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(name)) return apiError('invalid worker name');
      if (!uuid) return apiError('UUID required');
      const tokenRow = await env.DB.prepare("SELECT id, token FROM cf_tokens WHERE id = ? AND user_id = ? AND status = 'active'")
        .bind(body.cf_token_id ?? '', user.id).first<{ id: string; token: string }>();
      if (!tokenRow) return apiError('active token not found');

      const id = genId();
      await env.DB.prepare("INSERT INTO deployments (id, user_id, name, status, uuid, method, cf_token_row_id, created_at, updated_at) VALUES (?, ?, ?, 'deploying', ?, ?, ?, ?, ?)")
        .bind(id, user.id, name, uuid, body.method || 'workers', tokenRow.id, nowIso(), nowIso()).run();
      await logActivity(env, user.id, 'deployment_created', 'deployment', name);

      context.waitUntil(runDeployment(env, {
        deployment_id: id, worker_name: name, cf_token: tokenRow.token, uuid,
        proxyip: body.proxyip, admin_password: body.admin_password, origin: url.origin, worker_source: body.worker_source || 'edgetunnel',
      }));

      const row = await env.DB.prepare('SELECT * FROM deployments WHERE id = ?').bind(id).first();
      return json({ data: row }, 201);
    }
  }

  const depMatch = path.match(/^\/deployments\/([^/]+)$/);
  if (depMatch && method === 'DELETE') {
    const row = await env.DB.prepare('DELETE FROM deployments WHERE id = ? AND user_id = ? RETURNING name').bind(depMatch[1], user.id).first<{ name: string }>();
    if (!row) return apiError('worker not found', 404);
    await logActivity(env, user.id, 'deployment_deleted', 'deployment', row.name);
    return json({ success: true });
  }

  // Members
  const memberListMatch = path.match(/^\/deployments\/([^/]+)\/members$/);
  if (memberListMatch) {
    const depId = memberListMatch[1];
    const dep = await env.DB.prepare('SELECT id FROM deployments WHERE id = ? AND user_id = ?').bind(depId, user.id).first();
    if (!dep) return apiError('worker not found', 404);
    if (method === 'GET') {
      const r = await env.DB.prepare('SELECT * FROM worker_members WHERE deployment_id = ? ORDER BY created_at DESC').bind(depId).all();
      return json({ data: r.results.map((m: Record<string, unknown>) => ({ ...m, enabled: !!m.enabled, settings: safeJsonParse(String(m.settings || '{}'), {}) })) });
    }
    if (method === 'POST') {
      const body = (await request.json()) as { name?: string; expires_at?: string; quota_bytes?: number; request_quota?: number; ip_limit?: number };
      if (!body.name?.trim()) return apiError('name required');
      const id = genId();
      const token = genId();
      await env.DB.prepare('INSERT INTO worker_members (id, owner_user_id, deployment_id, name, token, enabled, expires_at, quota_bytes, request_quota, ip_limit) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)')
        .bind(id, user.id, depId, body.name.trim(), token, body.expires_at || null, body.quota_bytes || null, body.request_quota || null, body.ip_limit || null).run();
      await logActivity(env, user.id, 'member_created', 'member', body.name.trim());
      const row = await env.DB.prepare('SELECT * FROM worker_members WHERE id = ?').bind(id).first();
      return json({ data: row }, 201);
    }
  }

  const memberMatch = path.match(/^\/deployments\/([^/]+)\/members\/([^/]+)$/);
  if (memberMatch) {
    const depId = memberMatch[1];
    const memId = memberMatch[2];
    const dep = await env.DB.prepare('SELECT id FROM deployments WHERE id = ? AND user_id = ?').bind(depId, user.id).first();
    if (!dep) return apiError('worker not found', 404);
    if (method === 'PATCH') {
      const body = (await request.json()) as Record<string, unknown>;
      const sets: string[] = [];
      const binds: unknown[] = [];
      for (const [k, v] of Object.entries(body)) {
        if (['enabled', 'expires_at', 'quota_bytes', 'request_quota', 'ip_limit', 'name'].includes(k)) {
          sets.push(`${k} = ?`);
          binds.push(k === 'enabled' ? (v ? 1 : 0) : v);
        }
      }
      if (sets.length === 0) return apiError('no changes');
      binds.push(memId, depId);
      await env.DB.prepare(`UPDATE worker_members SET ${sets.join(', ')} WHERE id = ? AND deployment_id = ?`).bind(...binds).run();
      const row = await env.DB.prepare('SELECT * FROM worker_members WHERE id = ?').bind(memId).first();
      return json({ data: row });
    }
    if (method === 'DELETE') {
      const row = await env.DB.prepare('DELETE FROM worker_members WHERE id = ? AND deployment_id = ? RETURNING name').bind(memId, depId).first<{ name: string }>();
      if (!row) return apiError('member not found', 404);
      await logActivity(env, user.id, 'member_deleted', 'member', row.name);
      return json({ success: true });
    }
  }

  // Activity
  if (path === '/activity' && method === 'GET') {
    const r = await env.DB.prepare('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').bind(user.id).all();
    return json({ data: r.results });
  }

  return apiError('not found', 404);
};
