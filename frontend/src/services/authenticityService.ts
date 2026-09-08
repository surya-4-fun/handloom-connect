/**
 * Authenticity & Provenance Service
 * Connects frontend authenticity features to authoritative MySQL authenticity_passports data.
 * Zero fabricated GI numbers, Silk Mark certificates, or synthetic craft journeys.
 */

import { api } from './api'
import type { AuthenticityPassport } from '../types/authenticity'

/**
 * Fetches the authoritative authenticity passport for a given product ID or slug.
 * Returns null if no verified passport exists for the product.
 */
export async function fetchAuthenticityPassport(productIdOrSlug: string): Promise<AuthenticityPassport | null> {
  if (!productIdOrSlug) return null
  try {
    const res = await api.get<AuthenticityPassport | null>(`/products/${productIdOrSlug}/passport`)
    return res.data || null
  } catch (err) {
    console.warn(`[authenticityService] No authoritative passport found for product "${productIdOrSlug}":`, err)
    return null
  }
}
