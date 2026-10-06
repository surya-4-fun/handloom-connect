import { supabase } from '../lib/supabase'
import { Address, UserPreferences } from '../types/auth'

export interface UserProfileResponse {
  user: Record<string, unknown>
  addresses: Address[]
  preferences: UserPreferences
  orderCount: number
}

function mapAddress(a: { id: string; type: 'billing' | 'shipping'; full_name: string; address_line1: string; address_line2?: string; city: string; state: string; postal_code: string; country: string; is_default: boolean }): Address {
  return {
    id: a.id,
    type: a.type,
    fullName: a.full_name,
    addressLine1: a.address_line1,
    addressLine2: a.address_line2,
    city: a.city,
    state: a.state,
    postalCode: a.postal_code,
    country: a.country,
    isDefault: a.is_default
  }
}

export async function fetchUserProfile(): Promise<UserProfileResponse | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const userId = session.user.id
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()
  const { data: addresses } = await supabase.from('user_addresses').select('*').eq('user_id', userId)
  const { data: preferences } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single()
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', userId)

  return {
    user: user || { id: userId, email: session.user.email, role: 'customer' },
    addresses: (addresses || []).map(mapAddress),
    preferences: preferences || { newsletter: true, currency: 'INR', theme: 'dark' },
    orderCount: orderCount || 0
  }
}

export async function updateUserProfile(data: { fullName: string; avatarUrl?: string }): Promise<Record<string, unknown> | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  
  const updateData: Record<string, unknown> = {}
  if (data.fullName) updateData.full_name = data.fullName
  if (data.avatarUrl) updateData.avatar_url = data.avatarUrl
  
  const { data: updated } = await supabase.from('users').update(updateData).eq('id', session.user.id).select().single()
  
  // also update auth metadata
  if (data.fullName) {
    await supabase.auth.updateUser({ data: { full_name: data.fullName } })
  }
  return updated
}

export async function fetchUserAddresses(): Promise<Address[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []
  const { data } = await supabase.from('user_addresses').select('*').eq('user_id', session.user.id)
  return (data || []).map(mapAddress)
}

export async function addUserAddress(address: Omit<Address, 'id'>): Promise<Address | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  
  const insertData = {
    user_id: session.user.id,
    type: address.type,
    full_name: address.fullName,
    address_line1: address.addressLine1,
    address_line2: address.addressLine2,
    city: address.city,
    state: address.state,
    postal_code: address.postalCode,
    country: address.country,
    is_default: address.isDefault
  }
  
  const { data } = await supabase.from('user_addresses').insert(insertData).select().single()
  return data ? mapAddress(data) : null
}

export async function updateUserAddress(id: string, address: Partial<Address>): Promise<Address | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  
  const updateData: Record<string, unknown> = {}
  if (address.type !== undefined) updateData.type = address.type
  if (address.fullName !== undefined) updateData.full_name = address.fullName
  if (address.addressLine1 !== undefined) updateData.address_line1 = address.addressLine1
  if (address.addressLine2 !== undefined) updateData.address_line2 = address.addressLine2
  if (address.city !== undefined) updateData.city = address.city
  if (address.state !== undefined) updateData.state = address.state
  if (address.postalCode !== undefined) updateData.postal_code = address.postalCode
  if (address.country !== undefined) updateData.country = address.country
  if (address.isDefault !== undefined) updateData.is_default = address.isDefault
  
  const { data } = await supabase.from('user_addresses').update(updateData).eq('id', id).eq('user_id', session.user.id).select().single()
  return data ? mapAddress(data) : null
}

export async function deleteUserAddress(id: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return
  await supabase.from('user_addresses').delete().eq('id', id).eq('user_id', session.user.id)
}

export async function fetchUserPreferences(): Promise<UserPreferences | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  const { data } = await supabase.from('user_preferences').select('*').eq('user_id', session.user.id).single()
  return data
}

export async function updateUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  
  const { data: existing } = await supabase.from('user_preferences').select('user_id').eq('user_id', session.user.id).single()
  
  if (existing) {
    const { data } = await supabase.from('user_preferences').update(prefs).eq('user_id', session.user.id).select().single()
    return data
  } else {
    const { data } = await supabase.from('user_preferences').insert({ user_id: session.user.id, ...prefs }).select().single()
    return data
  }
}
