// ═══════════════════════════════════════════════════════════════════════════
// OOP Service Classes - Type-Safe API Layer
// ═══════════════════════════════════════════════════════════════════════════

// ── Interfaces ─────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface CfToken {
  id: string;
  name: string;
  token: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Deployment {
  id: string;
  name: string;
  status: 'pending' | 'deploying' | 'deployed' | 'failed';
  worker_url: string;
  uuid: string;
  method: string;
  worker_source: string;
  created_at: string;
  logs?: string;
  error_message?: string;
  kv_namespace_id?: string;
}

export interface Member {
  id: string;
  name: string;
  token: string;
  enabled: boolean;
  expires_at: string | null;
  quota_bytes: number | null;
  used_bytes: number;
  request_quota: number | null;
  used_requests: number;
  ip_limit: number | null;
  created_at: string;
}

export interface Activity {
  id: string;
  action: string;
  entity_type: string;
  entity_name: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

// ── Base API Client ────────────────────────────────────────────────────────
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.token = typeof localStorage !== 'undefined' ? localStorage.getItem('session_token') : null;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('session_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('session_token');
  }

  getToken(): string | null {
    return this.token;
  }

  async request<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.headers as Record<string, string> || {}),
    };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const resp = await fetch(`${this.baseUrl}${path}`, { ...opts, headers });
    const data: ApiResponse<T> = await resp.json();

    if (!resp.ok || data.error) {
      throw new Error(data.error || `Server error (${resp.status})`);
    }
    return (data.data ?? data) as T;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

// ── Auth Service ───────────────────────────────────────────────────────────
export class AuthService extends ApiClient {
  async signup(email: string, password: string): Promise<User> {
    return this.post<User>('/api/auth/signup', { email, password });
  }

  async login(email: string, password: string): Promise<Session> {
    const session = await this.post<Session>('/api/auth/login', { email, password });
    this.setToken(session.token);
    return session;
  }

  async me(): Promise<User> {
    return this.get<User>('/api/auth/me');
  }

  logout(): void {
    this.clearToken();
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}

// ── Token Service ──────────────────────────────────────────────────────────
export class TokenService extends ApiClient {
  async list(): Promise<CfToken[]> {
    return this.get<CfToken[]>('/api/tokens');
  }

  async create(name: string, token: string): Promise<CfToken> {
    return this.post<CfToken>('/api/tokens', { name, token });
  }

  async remove(id: string): Promise<void> {
    await this.delete(`/api/tokens/${id}`);
  }
}

// ── Deployment Service ─────────────────────────────────────────────────────
export class DeploymentService extends ApiClient {
  async list(): Promise<Deployment[]> {
    return this.get<Deployment[]>('/api/deployments');
  }

  async create(data: {
    name: string;
    uuid: string;
    cf_token_id: string;
    proxyip?: string;
    admin_password?: string;
    method?: string;
    worker_source?: string;
  }): Promise<Deployment> {
    return this.post<Deployment>('/api/deployments', data);
  }

  async remove(id: string): Promise<void> {
    await this.delete(`/api/deployments/${id}`);
  }
}

// ── Member Service ─────────────────────────────────────────────────────────
export class MemberService extends ApiClient {
  async list(deploymentId: string): Promise<Member[]> {
    return this.get<Member[]>(`/api/deployments/${deploymentId}/members`);
  }

  async create(deploymentId: string, data: {
    name: string;
    expires_at?: string;
    quota_bytes?: number;
    request_quota?: number;
    ip_limit?: number;
  }): Promise<Member> {
    return this.post<Member>(`/api/deployments/${deploymentId}/members`, data);
  }

  async updateMember(deploymentId: string, memberId: string, data: Record<string, unknown>): Promise<Member> {
    return super.patch<Member>(`/api/deployments/${deploymentId}/members/${memberId}`, data);
  }

  async remove(deploymentId: string, memberId: string): Promise<void> {
    await this.delete(`/api/deployments/${deploymentId}/members/${memberId}`);
  }
}

// ── Activity Service ───────────────────────────────────────────────────────
export class ActivityService extends ApiClient {
  async list(): Promise<Activity[]> {
    return this.get<Activity[]>('/api/activity');
  }
}

// ── Singleton Instances ────────────────────────────────────────────────────
export const apiClient = new ApiClient();
export const authService = new AuthService();
export const tokenService = new TokenService();
export const deploymentService = new DeploymentService();
export const memberService = new MemberService();
export const activityService = new ActivityService();

// Re-export for backward compatibility
export const auth = authService;
export const tokens = tokenService;
export const deployments = deploymentService;
export const members = memberService;
export const activity = activityService;
export const setToken = (t: string) => authService.setToken(t);
export const clearToken = () => authService.clearToken();
