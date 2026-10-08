import { supabase } from '../lib/supabase'
import type { ShopProduct, ShopCategory, ShopFilters, ShopArtisan } from '../types/shopTypes'
import type { AuthenticityPassport } from '../types/authenticity'
import { isUUID } from '../utils/uuid'
import { normalizeImageArray } from '../utils/imageUtils'

export interface ProductListResult {
  products: ShopProduct[]
  totalCount: number
}

export interface ProductDetailResult {
  product: ShopProduct
  artisan?: ShopArtisan
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

interface SupabaseProductRecord {
  id: string
  name: string
  slug: string
  category_id?: string
  categories?: { label: string }
  price: string | number
  display_price?: string
  images?: unknown
  alt?: string
  material: string
  region: string
  technique: string
  artisan_id?: string
  artisans?: { id: string; name: string; title?: string; region: string; craft: string; specialty?: string; experience?: string; bio?: string; story?: string; image: string }
  description?: string
  dimensions?: string
  care?: string
  provenance?: string
  shipping?: string
  in_stock?: boolean
  badge?: 'New' | 'Bestseller' | 'Limited' | 'Handwoven'
  colors?: string[]
}

function mapProduct(p: SupabaseProductRecord): ShopProduct {
  const numPrice = Number(p.price) || 0
  const displayPrice = p.display_price || (numPrice > 0 ? `₹${numPrice.toLocaleString('en-IN')}` : '₹0')

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categories?.label || '',
    categoryId: p.category_id,
    price: numPrice,
    displayPrice,
    images: normalizeImageArray(p.images),
    alt: p.alt || p.name || 'Handloom handcrafted creation',
    material: p.material || '',
    region: p.region || '',
    technique: p.technique || '',
    artisanId: p.artisan_id || p.artisans?.id || '',
    artisanName: p.artisans?.name,
    artisan: p.artisans ? {
      id: p.artisans.id,
      name: p.artisans.name,
      title: p.artisans.title,
      region: p.artisans.region,
      craft: p.artisans.craft,
      specialty: p.artisans.specialty,
      experience: p.artisans.experience || '',
      bio: p.artisans.bio || '',
      story: p.artisans.story,
      image: p.artisans.image
    } : undefined,
    description: p.description || '',
    dimensions: p.dimensions,
    care: p.care,
    provenance: p.provenance,
    badge: p.badge,
    inStock: p.in_stock ?? true
  }
}

export async function fetchProducts(filters: Partial<ShopFilters> & { page?: number; limit?: number } = {}): Promise<ProductListResult> {
  let query = supabase.from('products').select(`
    *,
    categories ( label ),
    artisans ( id, name, region, craft, image )
  `, { count: 'exact' })

  if (filters.search && filters.search.trim()) {
    query = query.or(`name.ilike.%${filters.search.trim()}%,description.ilike.%${filters.search.trim()}%`)
  }
  if (filters.priceRange) {
    query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1])
  }
  if (filters.materials?.length) query = query.in('material', filters.materials)
  if (filters.regions?.length) query = query.in('region', filters.regions)
  if (filters.techniques?.length) query = query.in('technique', filters.techniques)
  if (filters.artisanIds?.length) query = query.in('artisan_id', filters.artisanIds)
  if (filters.inStockOnly) query = query.eq('in_stock', true)

  if (filters.sort) {
    if (filters.sort === 'price-asc') query = query.order('price', { ascending: true })
    else if (filters.sort === 'price-desc') query = query.order('price', { ascending: false })
    else if (filters.sort === 'newest') query = query.order('created_at', { ascending: false })
  }

  // Handle category filter by ID (preferred UUID) or by label
  if (filters.category && filters.category !== 'all') {
    if (isUUID(filters.category)) {
      query = query.eq('category_id', filters.category)
    } else {
      const { data: cat } = await supabase.from('categories').select('id').ilike('label', filters.category).maybeSingle()
      if (cat?.id) {
        query = query.eq('category_id', cat.id)
      }
    }
  }

  const page = filters.page || 1
  const limit = filters.limit || 50
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) {
    console.error('Fetch products error:', error)
    return { products: [], totalCount: 0 }
  }

  return {
    products: (data || []).map(mapProduct),
    totalCount: count || 0
  }
}

export async function fetchProductDetail(idOrSlug: string): Promise<ProductDetailResult | null> {
  if (!idOrSlug) return null

  let query = supabase.from('products').select(`
    *,
    categories ( label ),
    artisans ( id, name, title, region, craft, specialty, experience, bio, story, image )
  `)
  
  if (isUUID(idOrSlug)) {
    query = query.eq('id', idOrSlug)
  } else {
    query = query.eq('slug', idOrSlug)
  }

  const { data, error } = await query.maybeSingle()
  if (error || !data) {
    if (error) console.error('Fetch product detail error:', error)
    return null
  }

  const product = mapProduct(data)

  // Fetch authenticity passport with safe fallback
  const { data: passportData, error: passportError } = await supabase
    .from('authenticity_passports')
    .select('*')
    .eq('product_id', data.id)
    .maybeSingle()

  if (passportError) {
    console.warn('Authenticity passport lookup notice:', passportError.message)
  }

  let mappedPassport: AuthenticityPassport | undefined = undefined
  if (passportData) {
    let craftJourney = []
    if (Array.isArray(passportData.craft_journey)) {
      craftJourney = passportData.craft_journey
    } else if (typeof passportData.craft_journey === 'string') {
      try {
        const parsed = JSON.parse(passportData.craft_journey)
        if (Array.isArray(parsed)) craftJourney = parsed
      } catch {
        craftJourney = []
      }
    }

    mappedPassport = {
      authenticityId: passportData.id,
      productId: passportData.product_id,
      productName: product.name,
      verificationStatus: passportData.verification_status || 'GI Associated Craft',
      handwovenVerified: Boolean(passportData.handwoven_verified),
      originVerified: Boolean(passportData.origin_verified),
      giRegistryNo: passportData.gi_registry_no || '',
      silkMarkNo: passportData.silk_mark_no || '',
      loomType: passportData.loom_type || '',
      warpThreadCount: passportData.warp_thread_count || '',
      weaveDensity: passportData.weave_density || '',
      culturalStory: passportData.cultural_story || '',
      craftJourney
    }
  }

  // Fetch related products in the same category
  const { data: relatedData } = await supabase
    .from('products')
    .select('*, categories ( label ), artisans ( id, name, region, craft, image )')
    .eq('category_id', data.category_id)
    .neq('id', data.id)
    .limit(4)

  return {
    product,
    artisan: data.artisans,
    passport: mappedPassport,
    relatedProducts: (relatedData || []).map(mapProduct)
  }
}

export async function fetchCategories(): Promise<ShopCategory[]> {
  const { data } = await supabase.from('categories').select('*')
  return (data || []).map((c: { id: string; label: string; image?: string }) => ({
    id: c.id,
    label: c.label,
    count: 0,
    image: c.image || ''
  }))
}

export async function fetchFacets(): Promise<ProductFacets> {
  const { data } = await supabase.from('products').select('material, region, technique, price')
  const materials = new Set<string>()
  const regions = new Set<string>()
  const techniques = new Set<string>()
  const minPrice = 0
  const maxPrice = 100000

  if (data) {
    data.forEach((p: { material: string; region: string; technique: string }) => {
      if (p.material) materials.add(p.material)
      if (p.region) regions.add(p.region)
      if (p.technique) techniques.add(p.technique)
    })
  }

  return {
    materials: Array.from(materials),
    regions: Array.from(regions),
    techniques: Array.from(techniques),
    minPrice,
    maxPrice
  }
}
