import { supabase } from '../lib/supabase'
import type { Product360Data, Product360Image } from '../types/product360'
import { isUUID } from '../utils/uuid'

const LOCAL_360_CATALOG: Record<string, { name: string; images: Product360Image[] }> = {
  'banarasi-zari-saree': {
    name: 'Banarasi Real Zari Katan Silk Saree',
    images: [
      { sequence: 1, url: '/images/360/banarasi-0.jpg', angleLabel: '0° Front Cascade' },
      { sequence: 2, url: '/images/360/banarasi-90.jpg', angleLabel: '90° Left Pleat View' },
      { sequence: 3, url: '/images/360/banarasi-180.jpg', angleLabel: '180° Rear Drape' },
      { sequence: 4, url: '/images/360/banarasi-270.jpg', angleLabel: '270° Zari Pallu Detail' }
    ]
  },
  '96cbfe59-c2c3-487e-9769-1f486241b3c8': {
    name: 'Banarasi Real Zari Katan Silk Saree',
    images: [
      { sequence: 1, url: '/images/360/banarasi-0.jpg', angleLabel: '0° Front Cascade' },
      { sequence: 2, url: '/images/360/banarasi-90.jpg', angleLabel: '90° Left Pleat View' },
      { sequence: 3, url: '/images/360/banarasi-180.jpg', angleLabel: '180° Rear Drape' },
      { sequence: 4, url: '/images/360/banarasi-270.jpg', angleLabel: '270° Zari Pallu Detail' }
    ]
  },
  'kanchipuram-korvai': {
    name: 'Kanchipuram Temple Border Korvai Silk',
    images: [
      { sequence: 1, url: '/images/360/kanchipuram-0.jpg', angleLabel: '0° Full Fold' },
      { sequence: 2, url: '/images/360/kanchipuram-90.jpg', angleLabel: '90° Border Folds' },
      { sequence: 3, url: '/images/360/kanchipuram-180.jpg', angleLabel: '180° Temple Gopuram Zari' },
      { sequence: 4, url: '/images/360/kanchipuram-270.jpg', angleLabel: '270° Pallu & Peacock Motif' }
    ]
  },
  'kanchipuram-silk-saree': {
    name: 'Kanchipuram Temple Border Korvai Silk',
    images: [
      { sequence: 1, url: '/images/360/kanchipuram-0.jpg', angleLabel: '0° Full Fold' },
      { sequence: 2, url: '/images/360/kanchipuram-90.jpg', angleLabel: '90° Border Folds' },
      { sequence: 3, url: '/images/360/kanchipuram-180.jpg', angleLabel: '180° Temple Gopuram Zari' },
      { sequence: 4, url: '/images/360/kanchipuram-270.jpg', angleLabel: '270° Pallu & Peacock Motif' }
    ]
  },
  '96cbfe59-c2c3-487e-9769-1f486241b3c9': {
    name: 'Kanchipuram Temple Border Korvai Silk',
    images: [
      { sequence: 1, url: '/images/360/kanchipuram-0.jpg', angleLabel: '0° Full Fold' },
      { sequence: 2, url: '/images/360/kanchipuram-90.jpg', angleLabel: '90° Border Folds' },
      { sequence: 3, url: '/images/360/kanchipuram-180.jpg', angleLabel: '180° Temple Gopuram Zari' },
      { sequence: 4, url: '/images/360/kanchipuram-270.jpg', angleLabel: '270° Pallu & Peacock Motif' }
    ]
  }
}

export async function fetchProduct360(idOrSlug: string): Promise<Product360Data | null> {
  if (!idOrSlug) return null

  const key = idOrSlug.toLowerCase().trim()
  if (LOCAL_360_CATALOG[key]) {
    const entry = LOCAL_360_CATALOG[key]
    return {
      productId: idOrSlug,
      productName: entry.name,
      slug: key,
      has360: true,
      images: entry.images
    }
  }

  try {
    let query = supabase.from('product_360_images').select('*, products!inner(id, slug, name)')
    if (isUUID(idOrSlug)) {
      query = query.eq('product_id', idOrSlug)
    } else {
      query = query.eq('products.slug', idOrSlug)
    }
    const { data } = await query.order('sequence_number', { ascending: true })
    if (!data || data.length === 0) return null
    return {
      productId: data[0].product_id,
      productName: data[0].products?.name || '',
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
