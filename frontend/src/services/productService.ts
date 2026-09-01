import { api } from './api'
import type { ShopProduct, ShopCategory, ShopFilters } from '../types/shopTypes'
import type { AuthenticityPassport } from '../types/authenticity'

export interface ProductListResult {
  products: ShopProduct[]
  totalCount: number
}

export interface ProductDetailResult {
  product: ShopProduct
  artisan?: any
  passport?: AuthenticityPassport
  relatedProducts: ShopProduct[]
}

export interface ProductFacets {
  materials: string[]
  regions: string[]
  techniques: string[]
  minPrice: number
  maxPrice: number
}

export async function fetchProducts(filters: Partial<ShopFilters> & { page?: number; limit?: number } = {}): Promise<ProductListResult> {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'all') params.append('category', filters.category)
  if (filters.search && filters.search.trim()) params.append('search', filters.search.trim())
  if (filters.priceRange) {
    params.append('minPrice', filters.priceRange[0].toString())
    params.append('maxPrice', filters.priceRange[1].toString())
  }
  if (filters.materials?.length) params.append('materials', filters.materials.join(','))
  if (filters.regions?.length) params.append('regions', filters.regions.join(','))
  if (filters.techniques?.length) params.append('techniques', filters.techniques.join(','))
  if (filters.artisanIds?.length) params.append('artisanIds', filters.artisanIds.join(','))
  if (filters.inStockOnly) params.append('inStockOnly', 'true')
  if (filters.sort) params.append('sort', filters.sort)
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())

  const queryString = params.toString() ? `?${params.toString()}` : ''
  const res = await api.get<any>(`/products${queryString}`)
  const payload = res.data
  const products: ShopProduct[] = Array.isArray(payload?.products)
    ? payload.products
    : Array.isArray(payload)
    ? payload
    : []
  const totalCount: number = typeof payload?.totalCount === 'number'
    ? payload.totalCount
    : products.length

  return { products, totalCount }
}

export async function fetchProductDetail(idOrSlug: string): Promise<ProductDetailResult | null> {
  const res = await api.get<ProductDetailResult>(`/products/${idOrSlug}`)
  return res.data
}

export async function fetchCategories(): Promise<ShopCategory[]> {
  const res = await api.get<ShopCategory[]>('/categories')
  return res.data
}

export async function fetchFacets(): Promise<ProductFacets> {
  const res = await api.get<ProductFacets>('/products/meta/facets')
  return res.data
}
