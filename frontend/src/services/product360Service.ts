import { api } from './api'
import type { Product360Data } from '../types/product360'

export async function fetchProduct360(idOrSlug: string): Promise<Product360Data | null> {
  try {
    const res = await api.get<Product360Data>(`/products/${idOrSlug}/360`)
    return res.data
  } catch (err: any) {
    console.error(`[360 Service] Backend 360 API unavailable for ${idOrSlug}:`, err.message)
    return null
  }
}
