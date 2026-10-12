/**
 * Safe conversion utility for image fields and Category-Aware Fallbacks.
 * Handles:
 * - PostgreSQL JSON/JSONB arrays already deserialized as arrays
 * - Valid JSON string representations of arrays
 * - Single image URL strings (e.g. Unsplash or CDN URLs)
 * - Objects with url properties
 * - Null, undefined, malformed or empty values
 * - Graceful category-aware fallbacks for missing or failed images
 * Never throws exceptions. Always returns a clean array of string URLs.
 */

export const CATEGORY_FALLBACKS: Record<string, string> = {
  sarees: '/images/fallbacks/saree-fallback.jpg',
  saree: '/images/fallbacks/saree-fallback.jpg',
  shawls: '/images/fallbacks/shawl-fallback.jpg',
  shawl: '/images/fallbacks/shawl-fallback.jpg',
  kurtas: '/images/fallbacks/kurta-fallback.jpg',
  kurta: '/images/fallbacks/kurta-fallback.jpg',
  'apparel & kurtas': '/images/fallbacks/kurta-fallback.jpg',
  apparel: '/images/fallbacks/kurta-fallback.jpg',
  dupattas: '/images/fallbacks/dupatta-fallback.jpg',
  dupatta: '/images/fallbacks/dupatta-fallback.jpg',
  stoles: '/images/fallbacks/stole-fallback.jpg',
  stole: '/images/fallbacks/stole-fallback.jpg',
  'stoles & dupattas': '/images/fallbacks/stole-fallback.jpg',
  'home-textiles': '/images/fallbacks/home-textile-fallback.jpg',
  'home textiles': '/images/fallbacks/home-textile-fallback.jpg',
  'home textiles & throws': '/images/fallbacks/home-textile-fallback.jpg',
  accessories: '/images/fallbacks/accessory-fallback.jpg',
  accessory: '/images/fallbacks/accessory-fallback.jpg',
  'raw-materials': '/images/fallbacks/raw-material-fallback.jpg',
  'raw-material': '/images/fallbacks/raw-material-fallback.jpg',
  raw_materials: '/images/fallbacks/raw-material-fallback.jpg',
  raw_material: '/images/fallbacks/raw-material-fallback.jpg',
  'silk yarn': '/images/raw-materials/raw-silk-filament-hank.jpg',
  'cotton yarn': '/images/raw-materials/khadi-charkha-yarn.jpg',
  wool: '/images/raw-materials/ladakhi-pashm-wool-top.jpg',
  indigo: '/images/raw-materials/indigo-dye-extract.jpg',
  'natural dyes': '/images/raw-materials/madder-dye.jpg',
  'weaving materials': '/images/raw-materials/gold-zari-spool.jpg',
  'craft accessories': '/images/raw-materials/teakwood-printing-blocks.jpg',
  artisan: '/images/fallbacks/artisan-fallback.jpg',
  artisans: '/images/fallbacks/artisan-fallback.jpg',
  general: '/images/fallbacks/general-fallback.jpg',
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
