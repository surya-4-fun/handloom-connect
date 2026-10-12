/**
 * Safe conversion utility for image fields, Authoritative Asset Mappings,
 * and Category-Aware Fallbacks.
 *
 * Guarantees:
 * 1. Verified local assets take precedence over stale/remote Unsplash URLs.
 * 2. Stable ID and slug resolution across all pages.
 * 3. Never throws exceptions, never creates infinite fallback loops.
 * 4. Fallback placeholders are visually distinguishable and guaranteed to exist.
 */

export const CATEGORY_FALLBACKS: Record<string, string> = {
  sarees: '/images/fallbacks/saree.jpg',
  saree: '/images/fallbacks/saree.jpg',
  'saree-fallback': '/images/fallbacks/saree.jpg',
  shawls: '/images/fallbacks/shawl.jpg',
  shawl: '/images/fallbacks/shawl.jpg',
  'shawl-fallback': '/images/fallbacks/shawl.jpg',
  kurtas: '/images/fallbacks/apparel.jpg',
  kurta: '/images/fallbacks/apparel.jpg',
  'apparel & kurtas': '/images/fallbacks/apparel.jpg',
  apparel: '/images/fallbacks/apparel.jpg',
  'kurta-fallback': '/images/fallbacks/apparel.jpg',
  dupattas: '/images/fallbacks/stole.jpg',
  dupatta: '/images/fallbacks/stole.jpg',
  'dupatta-fallback': '/images/fallbacks/stole.jpg',
  stoles: '/images/fallbacks/stole.jpg',
  stole: '/images/fallbacks/stole.jpg',
  'stoles & dupattas': '/images/fallbacks/stole.jpg',
  'stole-fallback': '/images/fallbacks/stole.jpg',
  'home-textiles': '/images/fallbacks/decor.jpg',
  'home textiles': '/images/fallbacks/decor.jpg',
  'home textiles & throws': '/images/fallbacks/decor.jpg',
  decor: '/images/fallbacks/decor.jpg',
  'home-textile-fallback': '/images/fallbacks/decor.jpg',
  accessories: '/images/fallbacks/product.jpg',
  accessory: '/images/fallbacks/product.jpg',
  'accessory-fallback': '/images/fallbacks/product.jpg',
  'raw-materials': '/images/fallbacks/fabric.jpg',
  'raw-material': '/images/fallbacks/fabric.jpg',
  raw_materials: '/images/fallbacks/fabric.jpg',
  raw_material: '/images/fallbacks/fabric.jpg',
  fabric: '/images/fallbacks/fabric.jpg',
  'raw-material-fallback': '/images/fallbacks/fabric.jpg',
  artisan: '/images/fallbacks/artisan.jpg',
  artisans: '/images/fallbacks/artisan.jpg',
  'artisan-fallback': '/images/fallbacks/artisan.jpg',
  product: '/images/fallbacks/product.jpg',
  general: '/images/fallbacks/product.jpg',
  'general-fallback': '/images/fallbacks/product.jpg',
}

/**
 * Authoritative mapping of products by stable slug and UUID to verified local photography assets.
 */
export const VERIFIED_PRODUCT_IMAGES: Record<string, string[]> = {
  // 1. Banarasi Zari Saree
  'banarasi-zari-saree': ['/images/products/banarasi-zari-saree.jpg', '/images/360/banarasi-270.jpg'],
  'shikargah-katan-silk-banarasi': ['/images/products/banarasi-zari-saree.jpg', '/images/360/banarasi-270.jpg'],
  'b0000001-0000-0000-0000-000000000001': ['/images/products/banarasi-zari-saree.jpg', '/images/360/banarasi-270.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3c8': ['/images/products/banarasi-zari-saree.jpg', '/images/360/banarasi-270.jpg'],

  // 2. Kanchipuram Silk / Korvai
  'kanchipuram-korvai': ['/images/products/kanchipuram-korvai.jpg', '/images/360/kanchipuram-270.jpg'],
  'korvai-temple-border-kanchipuram': ['/images/products/kanchipuram-korvai.jpg', '/images/360/kanchipuram-270.jpg'],
  'kanchipuram-silk-saree': ['/images/products/kanchipuram-korvai.jpg', '/images/360/kanchipuram-270.jpg'],
  'b0000001-0000-0000-0000-000000000002': ['/images/products/kanchipuram-korvai.jpg', '/images/360/kanchipuram-270.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3c9': ['/images/products/kanchipuram-korvai.jpg', '/images/360/kanchipuram-270.jpg'],

  // 3. Tussar Silk Stole
  'handspun-tussar-geometric-stole': ['/images/products/bhagalpuri-silk-stole.jpg'],
  'bhagalpuri-silk-stole': ['/images/products/bhagalpuri-silk-stole.jpg'],
  'b0000001-0000-0000-0000-000000000003': ['/images/products/bhagalpuri-silk-stole.jpg'],

  // 4. Kashmiri Sozni Pashmina Shawl
  'pashmina-sozni-shawl': ['/images/products/pashmina-sozni-shawl.jpg'],
  'kashmiri-sozni-jamawar-pashmina': ['/images/products/pashmina-sozni-shawl.jpg'],
  'pashmina-cashmere-shawl': ['/images/products/pashmina-sozni-shawl.jpg'],
  'b0000001-0000-0000-0000-000000000004': ['/images/products/pashmina-sozni-shawl.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3cc': ['/images/products/pashmina-sozni-shawl.jpg'],

  // 5. Chanderi Pure Silk-Cotton Zari Saree
  'chanderi-silk-saree': ['/images/products/chanderi-silk-saree.jpg'],
  'chanderi-tissue-zari-saree': ['/images/products/chanderi-silk-saree.jpg'],
  'chanderi-cotton-silk': ['/images/products/chanderi-silk-saree.jpg'],
  'b0000001-0000-0000-0000-000000000005': ['/images/products/chanderi-silk-saree.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3ca': ['/images/products/chanderi-silk-saree.jpg'],

  // 6. Ajrakh Modal Kurta
  'ajrakh-modal-kurta': ['/images/products/ajrakh-modal-kurta.jpg'],
  'ajrakh-hand-block-modal-kurta': ['/images/products/ajrakh-modal-kurta.jpg'],
  'ajrakh-block-print-kurta': ['/images/products/ajrakh-modal-kurta.jpg'],
  'b0000001-0000-0000-0000-000000000006': ['/images/products/ajrakh-modal-kurta.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3cd': ['/images/products/ajrakh-modal-kurta.jpg'],

  // 7. Bhujodi Kala Cotton Throw
  'indigo-throw': ['/images/products/indigo-throw.jpg'],
  'bhujodi-kala-cotton-throw': ['/images/products/indigo-throw.jpg'],
  'b0000001-0000-0000-0000-000000000007': ['/images/products/indigo-throw.jpg'],

  // 8. Paithani Peacock Pallu Saree
  'paithani-peacock-pallu-saree': ['/images/products/paithani-peacock-pallu-saree.jpg'],
  'b0000001-0000-0000-0000-000000000008': ['/images/products/paithani-peacock-pallu-saree.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3cf': ['/images/products/paithani-peacock-pallu-saree.jpg'],

  // Additional Catalog Products
  'chikankari-kurta': ['/images/products/chikankari-kurta.jpg'],
  'chikankari-embroidered-kurta': ['/images/products/chikankari-kurta.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3cb': ['/images/products/chikankari-kurta.jpg'],

  'bandhani-dupatta': ['/images/products/bandhani-dupatta.jpg'],
  'bandhani-silk-dupatta': ['/images/products/bandhani-dupatta.jpg'],
  '96cbfe59-c2c3-487e-9769-1f486241b3ce': ['/images/products/bandhani-dupatta.jpg'],

  'jamdani-muslin-saree': ['/images/products/jamdani-muslin-saree.jpg'],
  'pochampally-ikat': ['/images/products/pochampally-ikat.jpg'],
  'kani-pashmina-shawl': ['/images/products/kani-pashmina-shawl.jpg'],
  'kullu-wool-shawl': ['/images/products/kullu-wool-shawl.jpg'],
  'tussar-kalamkari-stole': ['/images/products/tussar-kalamkari-stole.jpg'],
  'ajrakh-cotton-stole': ['/images/products/ajrakh-cotton-stole.jpg'],
  'maheshwari-dupatta': ['/images/products/maheshwari-dupatta.jpg'],
  'phulkari-dupatta': ['/images/products/phulkari-dupatta.jpg'],
  'khadi-linen-kurta': ['/images/products/khadi-linen-kurta.jpg'],
  'bhadohi-carpet': ['/images/products/bhadohi-carpet.jpg'],
  'handspun-table-linen': ['/images/products/handspun-table-linen.jpg'],
  'pochampally-cushion-set': ['/images/products/pochampally-cushion-set.jpg'],
  'kalamkari-tote': ['/images/products/kalamkari-tote.jpg'],
  'silk-scarf': ['/images/products/patola-scarf.jpg'],
  'block-print-pouch': ['/images/products/block-print-pouch.jpg'],
}

/**
 * Authoritative mapping of master artisans by stable ID and UUID.
 */
export const VERIFIED_ARTISAN_IMAGES: Record<string, string> = {
  'rajeshwar-ansari': '/images/artisans/rajeshwar-ansari.jpg',
  'a0000001-0000-0000-0000-000000000001': '/images/artisans/rajeshwar-ansari.jpg',
  '60b4bb2e-4b40-4ce0-a2ea-9e7f4c9c22e1': '/images/artisans/rajeshwar-ansari.jpg',

  'meera-devi': '/images/artisans/meera-devi.jpg',
  'a0000001-0000-0000-0000-000000000002': '/images/artisans/meera-devi.jpg',
  '60b4bb2e-4b40-4ce0-a2ea-9e7f4c9c22e2': '/images/artisans/meera-devi.jpg',

  'saraswathi-guild': '/images/artisans/saraswathi-guild.jpg',
  'a0000001-0000-0000-0000-000000000003': '/images/artisans/saraswathi-guild.jpg',
  '60b4bb2e-4b40-4ce0-a2ea-9e7f4c9c22e3': '/images/artisans/saraswathi-guild.jpg',

  'ghulam-rasool': '/images/artisans/ghulam-rasool.jpg',
  'a0000001-0000-0000-0000-000000000004': '/images/artisans/ghulam-rasool.jpg',
  '60b4bb2e-4b40-4ce0-a2ea-9e7f4c9c22e4': '/images/artisans/ghulam-rasool.jpg',

  'nila-collective': '/images/artisans/nila-collective.jpg',
  'ismail-khatri': '/images/artisans/nila-collective.jpg',
  'a0000001-0000-0000-0000-000000000005': '/images/artisans/nila-collective.jpg',
  '60b4bb2e-4b40-4ce0-a2ea-9e7f4c9c22e5': '/images/artisans/nila-collective.jpg',

  'phulia-weavers': '/images/artisans/phulia-weavers.jpg',
  'devendra-vankar': '/images/artisans/hero-artisan.jpg',
  'a0000001-0000-0000-0000-000000000006': '/images/artisans/hero-artisan.jpg',
  '60b4bb2e-4b40-4ce0-a2ea-9e7f4c9c22e6': '/images/artisans/phulia-weavers.jpg',
}

/**
 * Resolves authoritative verified images for a product given its slug, id, or raw database images.
 * Always prefers verified authentic local assets over external/stale Unsplash URLs.
 */
export function getAuthoritativeProductImages(slugOrId?: string, rawImages?: unknown): string[] {
  if (slugOrId) {
    const key = slugOrId.toLowerCase().trim()
    if (VERIFIED_PRODUCT_IMAGES[key]) {
      return [...VERIFIED_PRODUCT_IMAGES[key]]
    }
  }

  const normalized = normalizeImageArray(rawImages)
  // If normalized images already contain valid local paths, return them
  const localPaths = normalized.filter(url => url.startsWith('/images/'))
  if (localPaths.length > 0) {
    return localPaths
  }

  if (normalized.length > 0) {
    return normalized
  }

  return []
}

/**
 * Resolves authoritative verified image for an artisan.
 */
export function getAuthoritativeArtisanImage(artisanId?: string, rawImage?: unknown): string {
  if (artisanId) {
    const key = artisanId.toLowerCase().trim()
    if (VERIFIED_ARTISAN_IMAGES[key]) {
      return VERIFIED_ARTISAN_IMAGES[key]
    }
  }

  if (typeof rawImage === 'string' && rawImage.trim().startsWith('/images/')) {
    return rawImage.trim()
  }

  if (typeof rawImage === 'string' && rawImage.trim()) {
    return rawImage.trim()
  }

  return getArtisanFallbackImage()
}

/**
 * Returns a category-specific fallback image path when a product image is missing.
 */
export function getCategoryFallbackImage(category?: unknown): string {
  if (!category || typeof category !== 'string') return CATEGORY_FALLBACKS.general
  const key = category.toLowerCase().trim()
  if (CATEGORY_FALLBACKS[key]) return CATEGORY_FALLBACKS[key]

  // Fuzzy match known category keywords
  for (const [k, fallback] of Object.entries(CATEGORY_FALLBACKS)) {
    if (k !== 'general' && (key.includes(k) || k.includes(key))) {
      return fallback
    }
  }

  return CATEGORY_FALLBACKS.general
}

/**
 * Returns an authentic artisan fallback image path.
 */
export function getArtisanFallbackImage(): string {
  return CATEGORY_FALLBACKS.artisan
}

/**
 * Returns a raw material fallback image path based on raw material category.
 */
export function getRawMaterialFallbackImage(category?: unknown): string {
  if (!category || typeof category !== 'string') return CATEGORY_FALLBACKS['raw-materials']
  const key = category.toLowerCase().trim()
  if (CATEGORY_FALLBACKS[key]) return CATEGORY_FALLBACKS[key]

  for (const [k, fallback] of Object.entries(CATEGORY_FALLBACKS)) {
    if (k !== 'general' && (key.includes(k) || k.includes(key))) {
      return fallback
    }
  }

  return CATEGORY_FALLBACKS['raw-materials']
}

export function normalizeImageArray(raw: unknown): string[] {
  if (!raw) return []

  // Case 1: Already an array
  if (Array.isArray(raw)) {
    return raw
      .map(item => {
        if (typeof item === 'string') return item.trim()
        if (item && typeof item === 'object' && 'url' in item) {
          return String((item as { url: unknown }).url).trim()
        }
        return ''
      })
      .filter(Boolean)
  }

  // Case 2: String
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []

    // Attempt JSON parse if it looks like JSON structure
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return normalizeImageArray(parsed)
        }
        if (parsed && typeof parsed === 'object') {
          if ('url' in parsed && typeof parsed.url === 'string') {
            return [parsed.url.trim()]
          }
          if ('images' in parsed && Array.isArray(parsed.images)) {
            return normalizeImageArray(parsed.images)
          }
        }
      } catch {
        // Fall through to plain URL string treatment
      }
    }

    // Direct plain URL or relative image path
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('data:')
    ) {
      return [trimmed]
    }

    return []
  }

  // Case 3: Object with url or image property
  if (typeof raw === 'object') {
    if ('url' in raw && typeof (raw as { url: unknown }).url === 'string') {
      const u = (raw as { url: string }).url.trim()
      return u ? [u] : []
    }
    if ('image' in raw && typeof (raw as { image: unknown }).image === 'string') {
      const u = (raw as { image: string }).image.trim()
      return u ? [u] : []
    }
  }

  return []
}
