/**
 * Handloom Connect - Centralized API Client Layer
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SESSION_KEY = 'hc_auth_token'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  code?: string
  errors?: Array<{ field: string; message: string }>
}

export class ApiError extends Error {
  statusCode: number
  code?: string
  errors?: Array<{ field: string; message: string }>

  constructor(message: string, statusCode = 500, code?: string, errors?: Array<{ field: string; message: string }>) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.errors = errors
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setAuthToken(token: string): void {
  localStorage.setItem(SESSION_KEY, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(SESSION_KEY)
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
  const token = getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: res.ok,
      message: res.statusText,
      data: null as any,
    }))

    if (!res.ok || !data.success) {
      throw new ApiError(
        data.message || `Request failed with status ${res.status}`,
        res.status,
        data.code,
        data.errors
      )
    }

    return data
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err
    }
    // Network or offline error
    throw new ApiError(err.message || 'Unable to connect to server', 0, 'NETWORK_ERROR')
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
}

export default api
