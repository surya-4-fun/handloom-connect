import { api } from './api'
import { Address, UserPreferences } from '../types/auth'

export interface UserProfileResponse {
  user: any
  addresses: Address[]
  preferences: UserPreferences
  orderCount: number
}

export async function fetchUserProfile(): Promise<UserProfileResponse | null> {
  try {
    const res = await api.get<UserProfileResponse>('/users/profile')
    return res.data
  } catch (err) {
    console.error('Failed to fetch user profile:', err)
    return null
  }
}

export async function updateUserProfile(data: { fullName: string; avatarUrl?: string }): Promise<any> {
  const res = await api.put('/users/profile', data)
  return res.data
}

export async function fetchUserAddresses(): Promise<Address[]> {
  try {
    const res = await api.get<Address[]>('/users/addresses')
    return res.data
  } catch {
    return []
  }
}

export async function addUserAddress(address: Omit<Address, 'id'>): Promise<Address> {
  const res = await api.post<Address>('/users/addresses', address)
  return res.data
}

export async function updateUserAddress(id: string, address: Partial<Address>): Promise<Address> {
  const res = await api.put<Address>(`/users/addresses/${id}`, address)
  return res.data
}

export async function deleteUserAddress(id: string): Promise<void> {
  await api.delete(`/users/addresses/${id}`)
}

export async function fetchUserPreferences(): Promise<UserPreferences | null> {
  try {
    const res = await api.get<UserPreferences>('/users/preferences')
    return res.data
  } catch {
    return null
  }
}

export async function updateUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  const res = await api.put<UserPreferences>('/users/preferences', prefs)
  return res.data
}
