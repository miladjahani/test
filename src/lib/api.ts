const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('session_token')
}

export function setToken(token: string) {
  localStorage.setItem('session_token', token)
}

export function clearToken() {
  localStorage.removeItem('session_token')
}

export async function api<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resp = await fetch(`${API_BASE}${path}`, { ...opts, headers })
  const data = await resp.json() as { data?: T; error?: string; success?: boolean; warning?: string }
  if (!resp.ok || data.error) throw new Error(data.error || `خطای سرور (${resp.status})`)
  return (data.data ?? data) as T
}

// Auth
export const auth = {
  signup: (email: string, password: string) =>
    api('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    api<{ token: string; user: { id: string; email: string; role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => api<{ id: string; email: string; role: string }>('/auth/me'),
}

// CF Tokens
export const tokens = {
  list: () => api<{ id: string; name: string; token: string; status: string; created_at: string }[]>('/tokens'),
  create: (name: string, token: string) =>
    api('/tokens', { method: 'POST', body: JSON.stringify({ name, token }) }),
  remove: (id: string) => api(`/tokens/${id}`, { method: 'DELETE' }),
}

// Deployments
export const deployments = {
  list: () => api<{ id: string; name: string; status: string; worker_url: string; uuid: string; method: string; worker_source: string; created_at: string; logs?: string; error_message?: string; config?: Record<string, unknown>; kv_namespace_id?: string }[]>('/deployments'),
  get: (id: string) => api(`/deployments/${id}`),
  create: (body: { name: string; uuid: string; cf_token_id: string; worker_source?: string; proxyip?: string; admin_password?: string; method?: string }) =>
    api('/deployments', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id: string) => api(`/deployments/${id}`, { method: 'DELETE' }),
  updateConfig: (id: string, config: Record<string, unknown>) =>
    api(`/deployments/${id}/config`, { method: 'PUT', body: JSON.stringify({ config }) }),
}

// Members (sub-users)
export const members = {
  list: (deploymentId: string) =>
    api<{ id: string; name: string; token: string; enabled: boolean; expires_at: string; quota_bytes: number; used_bytes: number; request_quota: number; used_requests: number; ip_limit: number; created_at: string; settings: Record<string, unknown> }[]>(`/deployments/${deploymentId}/members`),
  create: (deploymentId: string, body: { name: string; expires_at?: string; quota_bytes?: number; request_quota?: number; ip_limit?: number }) =>
    api(`/deployments/${deploymentId}/members`, { method: 'POST', body: JSON.stringify(body) }),
  patch: (deploymentId: string, memberId: string, body: Record<string, unknown>) =>
    api(`/deployments/${deploymentId}/members/${memberId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (deploymentId: string, memberId: string) =>
    api(`/deployments/${deploymentId}/members/${memberId}`, { method: 'DELETE' }),
}

// Activity
export const activity = {
  list: () => api<{ id: string; action: string; entity_type: string; entity_name: string; created_at: string }[]>('/activity'),
}
