export interface User {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
  joinedAt: string
}

export interface Address {
  id: string
  type: 'billing' | 'shipping'
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface UserPreferences {
  newsletter: boolean
  currency: 'INR' | 'USD' | 'EUR' | 'GBP'
  theme: 'system' | 'light' | 'dark'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password?: string // password optional in some flows if we ever add social, but required for standard
}

export interface RegisterData {
  fullName: string
  email: string
  password?: string
  acceptTerms: boolean
}
