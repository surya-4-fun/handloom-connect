import { api, setAuthToken, clearAuthToken } from './api'
import { User, LoginCredentials, RegisterData } from '../types/auth'

export async function loginUser(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  const res = await api.post<{ user: User; token: string }>('/auth/login', credentials)
  if (res.data?.token) {
    setAuthToken(res.data.token)
  }
  return res.data
}

export async function registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
  const res = await api.post<{ user: User; token: string }>('/auth/register', data)
  if (res.data?.token) {
    setAuthToken(res.data.token)
  }
  return res.data
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await api.get<User>('/auth/me')
    return res.data
  } catch (err: any) {
    clearAuthToken()
    if (err.statusCode !== 401) {
      console.error('getCurrentUser failed:', err.message)
    }
    return null
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch {
    // Ignore network error on logout
  } finally {
    clearAuthToken()
  }
}
