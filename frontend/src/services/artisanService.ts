import { supabase } from '../lib/supabase'
import type { ShopArtisan, ShopProduct } from '../types/shopTypes'
import { getAuthoritativeArtisanImage, getAuthoritativeProductImages } from '../utils/imageUtils'

export interface ArtisanDetailResult {
  artisan: ShopArtisan
  products: ShopProduct[]
  isFollowing: boolean
}

export interface ArtisanStoryResult {
  artisan: ShopArtisan
  products: ShopProduct[]
  verifiedAt: string
}

interface SupabaseArtisanRecord {
  id: string
  name: string
  title?: string
  region?: string
  craft?: string
  specialty?: string
  experience?: string
  bio?: string
  story?: string
  techniques?: unknown
  cultural_background?: string
  community_impact?: unknown
  image?: string
  is_featured?: boolean
  is_collective?: boolean
  follower_count?: number
  support_count?: number
}

function mapArtisan(a: SupabaseArtisanRecord): ShopArtisan {
  let techniques: string[] = []
  if (Array.isArray(a.techniques)) {
    techniques = a.techniques
  } else if (typeof a.techniques === 'string') {
    try {
      const parsed = JSON.parse(a.techniques)
      if (Array.isArray(parsed)) techniques = parsed
    } catch {
      techniques = [a.techniques]
    }
  }

  let communityImpact: ShopArtisan['communityImpact']
  if (typeof a.community_impact === 'object' && a.community_impact !== null) {
    communityImpact = a.community_impact as ShopArtisan['communityImpact']
  } else if (typeof a.community_impact === 'string') {
    try {
      communityImpact = JSON.parse(a.community_impact) as ShopArtisan['communityImpact']
    } catch {
      communityImpact = undefined
    }
  }

  return {
    id: a.id,
    name: a.name,
    title: a.title,
    region: a.region || '',
    craft: a.craft || '',
    specialty: a.specialty || '',
    experience: a.experience || '',
    bio: a.bio || '',
    story: a.story,
    techniques,
    culturalBackground: a.cultural_background,
    communityImpact,
    image: getAuthoritativeArtisanImage(a.id, a.image),
    isFeatured: Boolean(a.is_featured),
    isCollective: Boolean(a.is_collective),
    followerCount: Number(a.follower_count) || 0,
    supportCount: Number(a.support_count) || 0
  }
}

export async function fetchArtisans(params: { search?: string; region?: string; tab?: 'all' | 'masters' | 'collectives' } = {}): Promise<ShopArtisan[]> {
  let query = supabase.from('artisans').select('*')
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }
  if (params.region && params.region !== 'all') {
    query = query.eq('region', params.region)
  }
  if (params.tab === 'masters') {
    query = query.eq('is_featured', true)
  } else if (params.tab === 'collectives') {
    query = query.eq('is_collective', true)
  }
  
  const { data } = await query
  return (data || []).map(mapArtisan)
}

export async function fetchArtisanDetail(id: string): Promise<ArtisanDetailResult | null> {
  const { data: artisan } = await supabase.from('artisans').select('*').eq('id', id).single()
  if (!artisan) return null
  
  const { data: products } = await supabase.from('products').select('*').eq('artisan_id', id)
  
  let isFollowing = false
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    const { data: follow } = await supabase.from('artisan_follows').select('id').eq('user_id', session.user.id).eq('artisan_id', id).single()
    if (follow) isFollowing = true
  }
  
  return {
    artisan: mapArtisan(artisan),
    products: (products || []).map((p: { id: string; name: string; slug: string; price: number | string; display_price: string; images: string | string[]; alt?: string; material: string; region: string; technique: string; artisan_id: string; description: string; in_stock: boolean }) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: '',
      price: Number(p.price),
      displayPrice: p.display_price,
      images: getAuthoritativeProductImages(p.slug || p.id, p.images),
      alt: p.alt || '',
      material: p.material,
      region: p.region,
      technique: p.technique,
      artisanId: p.artisan_id,
      description: p.description,
      inStock: p.in_stock
    })),
    isFollowing
  }
}

export async function fetchArtisanStory(id: string): Promise<ArtisanStoryResult | null> {
  const detail = await fetchArtisanDetail(id)
  if (!detail) return null
  return {
    artisan: detail.artisan,
    products: detail.products,
    verifiedAt: new Date().toISOString()
  }
}

export async function toggleFollowArtisan(id: string): Promise<{ following: boolean }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { following: false }
  
  const { data: existing } = await supabase.from('artisan_follows').select('id').eq('user_id', session.user.id).eq('artisan_id', id).single()
  
  if (existing) {
    await supabase.from('artisan_follows').delete().eq('id', existing.id)
    return { following: false }
  } else {
    await supabase.from('artisan_follows').insert({ user_id: session.user.id, artisan_id: id })
    return { following: true }
  }
}

export async function fetchFollowedArtisanIds(): Promise<string[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []
  
  const { data } = await supabase.from('artisan_follows').select('artisan_id').eq('user_id', session.user.id)
  return (data || []).map(d => d.artisan_id)
}

export async function supportArtisan(id: string, tier = 1200): Promise<{ supportCount: number; tier: number }> {
  const { data: artisan } = await supabase.from('artisans').select('support_count').eq('id', id).single()
  if (artisan) {
    await supabase.from('artisans').update({ support_count: artisan.support_count + 1 }).eq('id', id)
    return { supportCount: artisan.support_count + 1, tier }
  }
  return { supportCount: 0, tier }
}
