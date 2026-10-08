/**
 * Safe conversion utility for image fields.
 * Handles:
 * - PostgreSQL JSON/JSONB arrays already deserialized as arrays
 * - Valid JSON string representations of arrays
 * - Single image URL strings (e.g. Unsplash or CDN URLs)
 * - Objects with url properties
 * - Null, undefined, malformed or empty values
 * Never throws exceptions. Always returns a clean array of string URLs.
 */
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
