import { supabase } from '../lib/supabase'
import type { ShopArtisan, ShopProduct } from '../types/shopTypes'
import { normalizeImageArray } from '../utils/imageUtils'

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

function mapArtisan(a: { id: string; name: string; title: string; region: string; craft: string; specialty: string; experience: string; bio: string; story: string; techniques: string[]; cultural_background: string; community_impact: { activeLooms: number; fairWagePercentage: number; apprenticesTrained: number; summary: string }; image: string; is_featured: boolean; is_collective: boolean; follower_count: number; support_count: number }): ShopArtisan {
  return {
    id: a.id,
    name: a.name,
    title: a.title,
    region: a.region,
    craft: a.craft,
    specialty: a.specialty,
    experience: a.experience,
    bio: a.bio,
    story: a.story,
    techniques: a.techniques,
    culturalBackground: a.cultural_background,
    communityImpact: a.community_impact,
    image: a.image,
    isFeatured: a.is_featured,
    isCollective: a.is_collective,
    followerCount: a.follower_count,
    supportCount: a.support_count
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
      images: normalizeImageArray(p.images),
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
