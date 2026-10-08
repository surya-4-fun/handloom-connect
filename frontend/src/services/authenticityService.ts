import { supabase } from '../lib/supabase'
import type { AuthenticityPassport } from '../types/authenticity'
import { isUUID } from '../utils/uuid'

export async function fetchAuthenticityPassport(productIdOrSlug: string): Promise<AuthenticityPassport | null> {
  if (!productIdOrSlug) return null
  try {
    let query = supabase.from('authenticity_passports').select('*, products!inner(slug)')
    if (isUUID(productIdOrSlug)) {
      query = query.eq('product_id', productIdOrSlug)
    } else {
      query = query.eq('products.slug', productIdOrSlug)
    }
    const { data } = await query.single()
    if (!data) return null
    return {
      id: data.id,
      authenticityId: data.id,
      productId: data.product_id,
      productName: '',
      verificationStatus: data.verification_status,
      handwovenVerified: data.handwoven_verified,
      originVerified: data.origin_verified,
      giRegistryNo: data.gi_registry_no,
      silkMarkNo: data.silk_mark_no,
      loomType: data.loom_type,
      warpThreadCount: data.warp_thread_count,
      weaveDensity: data.weave_density,
      culturalStory: data.cultural_story,
      craftJourney: typeof data.craft_journey === 'string' ? JSON.parse(data.craft_journey) : data.craft_journey,
      issuedAt: data.created_at
    } as AuthenticityPassport
  } catch (err) {
    console.warn(`[authenticityService] No authoritative passport found for product "${productIdOrSlug}":`, err)
    return null
  }
}
