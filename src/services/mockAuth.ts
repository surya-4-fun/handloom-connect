import { User, LoginCredentials, RegisterData } from '../types/auth'

// Mock Data
const MOCK_USER_ID = 'user_hc_2026'

const MOCK_DB: { users: Array<{ id: string; email: string; password?: string; fullName: string; avatarUrl?: string; joinedAt: string }> } = {
  users: [
    {
      id: MOCK_USER_ID,
      email: 'collector@handloomconnect.com',
      password: 'password123',
      fullName: 'Ananya Collector',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      joinedAt: '2025-10-12T00:00:00.000Z'
    }
  ]
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// LocalStorage key for session token
const SESSION_KEY = 'hc_auth_token'

/**
 * Simulates a backend login request.
 */
export async function mockLogin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  await delay(800) // network delay
  
  const userRecord = MOCK_DB.users.find(u => u.email === credentials.email && u.password === credentials.password)
  
  if (!userRecord) {
    throw new Error('Invalid email or password')
  }

  const user: User = {
    id: userRecord.id,
    fullName: userRecord.fullName,
    email: userRecord.email,
    avatarUrl: userRecord.avatarUrl,
    joinedAt: userRecord.joinedAt
  }

  const token = `mock_token_${userRecord.id}_${Date.now()}`
  localStorage.setItem(SESSION_KEY, token)

  return { user, token }
}

/**
 * Simulates a backend registration request.
 */
export async function mockRegister(data: RegisterData): Promise<{ user: User; token: string }> {
  await delay(1000)
  
  if (MOCK_DB.users.some(u => u.email === data.email)) {
    throw new Error('An account with this email already exists')
  }

  const newUser = {
    id: `user_hc_${Date.now()}`,
    email: data.email,
    password: data.password || 'default_pw',
    fullName: data.fullName,
    avatarUrl: undefined as string | undefined,
    joinedAt: new Date().toISOString()
  }

  MOCK_DB.users.push(newUser)

  const user: User = {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    joinedAt: newUser.joinedAt
  }

  const token = `mock_token_${newUser.id}_${Date.now()}`
  localStorage.setItem(SESSION_KEY, token)

  return { user, token }
}

/**
 * Validates a session token and fetches the current user profile.
 */
export async function mockGetProfile(): Promise<User | null> {
  const token = localStorage.getItem(SESSION_KEY)
  if (!token) return null
  
  await delay(400) // network delay

  // Extract user ID from our mock token (mock_token_id_timestamp)
  const parts = token.split('_')
  if (parts.length < 3) return null
  
  const userId = parts.slice(2, parts.length - 1).join('_')
  
  const userRecord = MOCK_DB.users.find(u => u.id === userId) || MOCK_DB.users[0] // fallback for new registrations in this mock
  
  if (!userRecord) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  return {
    id: userRecord.id,
    fullName: userRecord.fullName,
    email: userRecord.email,
    avatarUrl: userRecord.avatarUrl,
    joinedAt: userRecord.joinedAt
  }
}

/**
 * Clears the session.
 */
export async function mockLogout(): Promise<void> {
  await delay(300)
  localStorage.removeItem(SESSION_KEY)
}
