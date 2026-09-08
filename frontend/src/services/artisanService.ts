import { api } from './api'
import type { ShopArtisan, ShopProduct } from '../types/shopTypes'

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

export async function fetchArtisans(params: { search?: string; region?: string; tab?: 'all' | 'masters' | 'collectives' } = {}): Promise<ShopArtisan[]> {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.append('search', params.search)
  if (params.region && params.region !== 'all') searchParams.append('region', params.region)
  if (params.tab && params.tab !== 'all') searchParams.append('tab', params.tab)

  const qs = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const res = await api.get<ShopArtisan[]>(`/artisans${qs}`)
  return res.data
}

export async function fetchArtisanDetail(id: string): Promise<ArtisanDetailResult | null> {
  const res = await api.get<ArtisanDetailResult>(`/artisans/${id}`)
  return res.data
}

export async function fetchArtisanStory(id: string): Promise<ArtisanStoryResult | null> {
  try {
    const res = await api.get<ArtisanStoryResult>(`/artisans/${id}/story`)
    return res.data
  } catch (err: any) {
    console.warn(`[Artisan Service] Failed to fetch artisan story for ${id}:`, err?.message)
    return null
  }
}

export async function toggleFollowArtisan(id: string): Promise<{ following: boolean }> {
  const res = await api.post<{ following: boolean }>(`/artisans/${id}/follow`)
  return res.data
}

export async function fetchFollowedArtisanIds(): Promise<string[]> {
  const res = await api.get<string[]>('/artisans/user/followed')
  return res.data
}

export async function supportArtisan(id: string, tier = 1200): Promise<{ supportCount: number; tier: number }> {
  const res = await api.post<{ supportCount: number; tier: number }>(`/artisans/${id}/support`, { tier })
  return res.data
}
