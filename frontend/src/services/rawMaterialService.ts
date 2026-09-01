import { api } from './api'
import type { RawMaterial, BulkRequestForm } from '../types/rawMaterial'

export async function fetchRawMaterials(filters: {
  category?: string
  origin?: string
  quality?: string
  inStockOnly?: boolean
  search?: string
  sort?: string
} = {}): Promise<RawMaterial[]> {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'all') params.append('category', filters.category)
  if (filters.origin && filters.origin !== 'all') params.append('origin', filters.origin)
  if (filters.quality && filters.quality !== 'all') params.append('quality', filters.quality)
  if (filters.inStockOnly) params.append('inStockOnly', 'true')
  if (filters.search) params.append('search', filters.search)
  if (filters.sort) params.append('sort', filters.sort)

  const qs = params.toString() ? `?${params.toString()}` : ''
  const res = await api.get<RawMaterial[]>(`/raw-materials${qs}`)
  return res.data
}

export async function fetchRawMaterialById(id: string): Promise<RawMaterial | null> {
  const res = await api.get<RawMaterial>(`/raw-materials/${id}`)
  return res.data
}

export async function submitBulkRequest(form: BulkRequestForm): Promise<{ referenceNo: string }> {
  const res = await api.post<{ referenceNo: string }>('/raw-materials/bulk-quote', form)
  return res.data
}
