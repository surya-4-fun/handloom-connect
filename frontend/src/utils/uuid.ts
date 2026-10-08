/**
 * Strict UUID detection helper.
 * Validates standard 8-4-4-4-12 hex UUID formats (v1 through v5).
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUUID(value: string | undefined | null): boolean {
  if (!value || typeof value !== 'string') return false
  return UUID_REGEX.test(value.trim())
}
