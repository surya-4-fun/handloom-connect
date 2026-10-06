import { supabase } from '../lib/supabase'
import { User, LoginCredentials, RegisterData } from '../types/auth'

function mapUser(profile: { id: string; full_name: string; email: string; avatar_url?: string; created_at?: string }): User {
  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    joinedAt: profile.created_at || new Date().toISOString()
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password || ''
  })
  if (error) throw error
  if (!data.user) throw new Error('No user returned')
  
  const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()
  
  return { 
    user: profile ? mapUser(profile) : { id: data.user.id, fullName: 'User', email: data.user.email || '', joinedAt: new Date().toISOString() }, 
    token: data.session?.access_token || '' 
  }
}

export async function registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password || '',
    options: {
      data: {
        full_name: data.fullName
      }
    }
  })
  if (error) throw error
  if (!authData.user) throw new Error('No user returned')
  
  // Insert into users table
  const { data: profile, error: insertError } = await supabase.from('users').insert({
    id: authData.user.id,
    email: data.email,
    full_name: data.fullName,
    role: 'customer'
  }).select().single()
  
  if (insertError && insertError.code !== '23505') {
    console.error('Failed to insert user profile:', insertError)
  }
  
  return { 
    user: profile ? mapUser(profile) : { id: authData.user.id, fullName: data.fullName, email: data.email, joinedAt: new Date().toISOString() }, 
    token: authData.session?.access_token || '' 
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  
  const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
  return profile ? mapUser(profile) : { id: session.user.id, fullName: session.user.user_metadata?.full_name || 'User', email: session.user.email || '', joinedAt: session.user.created_at }
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut()
}
