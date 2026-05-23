const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'chilon_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

type RequestOptions = RequestInit & { body?: any };

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body = options.body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
    if (typeof body !== 'string') body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers, body });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'Unauthorized');
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (payload && typeof payload === 'object' && (payload as any).error) || res.statusText;
    throw new ApiError(res.status, message, payload);
  }
  return payload as T;
}

export const api = {
  get:    <T = any>(path: string)               => request<T>(path),
  post:   <T = any>(path: string, body?: any)   => request<T>(path, { method: 'POST',   body }),
  put:    <T = any>(path: string, body?: any)   => request<T>(path, { method: 'PUT',    body }),
  patch:  <T = any>(path: string, body?: any)   => request<T>(path, { method: 'PATCH',  body }),
  delete: <T = any>(path: string)               => request<T>(path, { method: 'DELETE' }),
  upload: <T = any>(path: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<T>(path, { method: 'POST', body: form });
  },
};

export function uploadUrl(relPath: string | null | undefined): string | undefined {
  if (!relPath) return undefined;
  if (/^https?:\/\//.test(relPath)) return relPath;
  return `${API_URL}${relPath.startsWith('/') ? '' : '/'}${relPath}`;
}
