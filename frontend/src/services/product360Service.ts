import { supabase } from '../lib/supabase'
import type { Product360Data } from '../types/product360'

export async function fetchProduct360(idOrSlug: string): Promise<Product360Data | null> {
  try {
    let query = supabase.from('product_360_images').select('*, products!inner(id, slug)')
    if (idOrSlug.length > 20) {
      query = query.eq('product_id', idOrSlug)
    } else {
      query = query.eq('products.slug', idOrSlug)
    }
    const { data } = await query.order('sequence_number', { ascending: true })
    if (!data || data.length === 0) return null
    return {
      productId: data[0].product_id,
      productName: '',
      has360: true,
      images: data.map(d => ({
        url: d.image_url,
        sequence: d.sequence_number,
        angleLabel: d.angle_label
      }))
    }
  } catch (err: unknown) {
    console.error(`[360 Service] 360 images unavailable for ${idOrSlug}:`, err instanceof Error ? err.message : String(err))
    return null
  }
}
