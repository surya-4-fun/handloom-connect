import { supabase } from '../lib/supabase'
import type { Product360Data, Product360Image } from '../types/product360'
import { isUUID } from '../utils/uuid'

interface LocalCatalogEntry {
  name: string
  images: Product360Image[]
}

const BANARASI_360_ENTRY: LocalCatalogEntry = {
  name: 'Banarasi Real Zari Katan Silk Saree',
  images: [
    { sequence: 1, url: '/images/360/banarasi-0.jpg', angleLabel: '0° Front Cascade', angleDegrees: 0, viewType: 'front' },
    { sequence: 2, url: '/images/360/banarasi-90.jpg', angleLabel: '90° Left Pleat View', angleDegrees: 90, viewType: 'side' },
    { sequence: 3, url: '/images/360/banarasi-180.jpg', angleLabel: '180° Reverse Drape View', angleDegrees: 180, viewType: 'rear' },
    { sequence: 4, url: '/images/360/banarasi-270.jpg', angleLabel: '270° Zari Pallu Detail', angleDegrees: 270, viewType: 'detail' }
  ]
}

const KANCHIPURAM_360_ENTRY: LocalCatalogEntry = {
  name: 'Kanchipuram Temple Border Korvai Silk',
  images: [
    { sequence: 1, url: '/images/360/kanchipuram-0.jpg', angleLabel: '0° Full Fold View', angleDegrees: 0, viewType: 'fold' },
    { sequence: 2, url: '/images/360/kanchipuram-90.jpg', angleLabel: '90° Border Folds', angleDegrees: 90, viewType: 'side' },
    { sequence: 3, url: '/images/360/kanchipuram-180.jpg', angleLabel: '180° Temple Gopuram Zari', angleDegrees: 180, viewType: 'rear' },
    { sequence: 4, url: '/images/360/kanchipuram-270.jpg', angleLabel: '270° Pallu & Peacock Motif', angleDegrees: 270, viewType: 'detail' }
  ]
}

const LOCAL_360_CATALOG: Record<string, LocalCatalogEntry> = {
  // Banarasi Real Zari Katan Silk Saree (all verified identifiers)
  'banarasi-zari-saree': BANARASI_360_ENTRY,
  'shikargah-katan-silk-banarasi': BANARASI_360_ENTRY,
  'b0000001-0000-0000-0000-000000000001': BANARASI_360_ENTRY,
  '96cbfe59-c2c3-487e-9769-1f486241b3c8': BANARASI_360_ENTRY,

  // Kanchipuram Temple Border Korvai Silk (all verified identifiers)
  'kanchipuram-korvai': KANCHIPURAM_360_ENTRY,
  'korvai-temple-border-kanchipuram': KANCHIPURAM_360_ENTRY,
  'kanchipuram-silk-saree': KANCHIPURAM_360_ENTRY,
  'b0000001-0000-0000-0000-000000000002': KANCHIPURAM_360_ENTRY,
  '96cbfe59-c2c3-487e-9769-1f486241b3c9': KANCHIPURAM_360_ENTRY
}

/**
 * Checks synchronously whether a product identifier has verified multi-angle frames.
 */
export function isMultiAngleSupported(idOrSlug?: string): boolean {
  if (!idOrSlug) return false
  const key = idOrSlug.toLowerCase().trim()
  return Boolean(LOCAL_360_CATALOG[key])
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
      isMultiAngle: true,
      totalAngles: entry.images.length,
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

    // Filter out unverified external placeholders if any exist
    const validImages = data
      .filter(d => Boolean(d.image_url))
      .map(d => ({
        url: d.image_url,
        sequence: d.sequence_number,
        angleLabel: d.angle_label || `Perspective ${d.sequence_number}`
      }))

    if (validImages.length === 0) return null

    return {
      productId: data[0].product_id,
      productName: data[0].products?.name || '',
      has360: validImages.length > 1,
      isMultiAngle: validImages.length > 1,
      totalAngles: validImages.length,
      images: validImages
    }
  } catch (err: unknown) {
    console.warn(`[360 Service] Multi-angle images unavailable for ${idOrSlug}:`, err instanceof Error ? err.message : String(err))
    return null
  }
}
