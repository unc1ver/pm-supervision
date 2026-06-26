/**
 * 前端 API 客户端层
 * 封装所有与后端的通信，统一处理 token、错误和降级
 */

const API_BASE = '/api';

// Token 管理
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

function clearToken(): void {
  localStorage.removeItem('auth_token');
}

// 通用请求方法
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token 过期，清除登录状态
    clearToken();
    window.location.reload();
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '网络请求失败' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ========== Auth API ==========
export const authApi = {
  login: async (username: string, password: string) => {
    return request<{ token: string; user: { id: string; name: string; role: string; avatar: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
  },

  logout: () => {
    clearToken();
  },

  getToken,
  isLoggedIn: () => !!getToken(),
};

// ========== Dashboard API ==========
export const dashboardApi = {
  getStats: () =>
    request<{
      total_projects: number;
      project_growth: number;
      security_rating: number;
      security_trend: string;
      compliance_rate: number;
      compliance_trend: string;
      active_alerts: number;
      completed_inspections: number;
      total_inspections: number;
      coverage_rate: number;
    }>('/dashboard/stats'),
};

// ========== Inspections API ==========
export interface InspectionRecord {
  id: string;
  name: string;
  status: 'completed' | 'ongoing' | 'pending';
  date: string;
  score: number;
}

export const inspectionsApi = {
  getAll: () => request<InspectionRecord[]>('/inspections'),
  update: (id: string, data: Partial<InspectionRecord>) =>
    request<InspectionRecord>(`/inspections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ========== Alerts API ==========
export interface AlertItem {
  id: string;
  type: 'critical' | 'system' | 'warning' | 'info';
  title: string;
  desc: string;
  time: string;
  dismissed: boolean;
}

export const alertsApi = {
  getAll: () => request<AlertItem[]>('/alerts'),
  dismiss: (id: string) =>
    request<AlertItem>(`/alerts/${id}/dismiss`, { method: 'PATCH' }),
  deploy: (id: string) =>
    request<{ id: string; deployed: boolean }>(`/alerts/${id}/deploy`, { method: 'POST' }),
};

// ========== Nodes API ==========
export interface DataNode {
  id: string;
  name: string;
  location: string;
  status: 'normal' | 'syncing' | 'disconnected';
  kpi: number;
}

export const nodesApi = {
  getAll: () => request<DataNode[]>('/nodes'),
  update: (id: string, data: Partial<DataNode>) =>
    request<DataNode>(`/nodes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ========== Logs API ==========
export interface LogEntry {
  id: string;
  title: string;
  time: string;
  operator: string;
  type: 'success' | 'system' | 'error';
}

export const logsApi = {
  getAll: () => request<LogEntry[]>('/logs'),
  add: (log: Omit<LogEntry, 'id'>) =>
    request<LogEntry>('/logs', {
      method: 'POST',
      body: JSON.stringify(log),
    }),
};

// ========== Org API ==========
export interface OrgNode {
  id: string;
  name: string;
  role: string;
  leader: string;
  phone?: string;
  email?: string;
  status?: 'normal' | 'warning' | 'error';
  children?: OrgNode[];
}

export const orgApi = {
  getTree: () => request<OrgNode>('/org'),
};

export { setToken, clearToken };
