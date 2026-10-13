import { supabase } from '../lib/supabase'
import type { RawMaterial, BulkRequestForm, RawMaterialCategory, MaterialQuality } from '../types/rawMaterial'
import { getAuthoritativeRawMaterialImages } from '../utils/imageUtils'
import { RAW_MATERIALS } from '../utils/mocks/rawMaterialData'

interface SupabaseRawMaterialRecord {
  id: string
  name: string
  category: RawMaterialCategory
  material_type: string
  origin: string
  supplier_id: string
  material_suppliers?: { name: string } | { name: string }[] | null
  quality: MaterialQuality
  quantity_unit: string
  price: string | number
  display_price: string
  min_order_qty: number
  in_stock: boolean
  sustainability_info?: string
  description?: string
  images?: string | string[]
  badge?: "Artisan Grade" | "Organic Vat" | "Direct Guild" | "GI Certified"
  denier_or_count?: string
}

function mapRawMaterial(m: SupabaseRawMaterialRecord): RawMaterial {
  const supplierRecord = Array.isArray(m.material_suppliers)
    ? m.material_suppliers[0]
    : m.material_suppliers
  return {
    id: m.id,
    name: m.name,
    category: m.category,
    materialType: m.material_type,
    origin: m.origin,
    supplier: {
      id: m.supplier_id,
      name: supplierRecord?.name || 'Unknown',
      location: '',
      rating: 0,
      certified: false,
      verifiedGI: false,
      specialty: '',
      contactEmail: ''
    },
    quality: m.quality,
    quantityUnit: m.quantity_unit,
    price: Number(m.price),
    displayPrice: m.display_price,
    minOrderQty: m.min_order_qty,
    inStock: m.in_stock,
    sustainabilityInfo: m.sustainability_info || '',
    description: m.description || '',
    images: getAuthoritativeRawMaterialImages(m.id, m.name, m.images),
    badge: m.badge,
    denierOrCount: m.denier_or_count
  }
}

export async function fetchRawMaterials(filters: {
  category?: string
  origin?: string
  quality?: string
  inStockOnly?: boolean
  search?: string
  sort?: string
} = {}): Promise<RawMaterial[]> {
  let query = supabase.from('raw_materials').select('*, material_suppliers(name)')
  if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category)
  if (filters.origin && filters.origin !== 'all') query = query.ilike('origin', `%${filters.origin}%`)
  if (filters.quality && filters.quality !== 'all') query = query.eq('quality', filters.quality)
  if (filters.inStockOnly) query = query.eq('in_stock', true)
  if (filters.search) query = query.ilike('name', `%${filters.search}%`)
  
  if (filters.sort) {
    if (filters.sort === 'price-asc') query = query.order('price', { ascending: true })
    else if (filters.sort === 'price-desc') query = query.order('price', { ascending: false })
    else if (filters.sort === 'min-order') query = query.order('min_order_qty', { ascending: true })
  }
  
  const { data, error } = await query
  const dbMaterials = !error && data ? data.map(mapRawMaterial) : []

  // Map mock materials with authoritative verified image resolver
  const mockMapped: RawMaterial[] = RAW_MATERIALS.map(m => ({
    ...m,
    images: getAuthoritativeRawMaterialImages(m.id, m.name, m.images)
  }))

  // If Supabase returns records, merge any mock materials that do not exist in the database
  let allMaterials: RawMaterial[] = dbMaterials
  if (dbMaterials.length > 0) {
    const existingNames = new Set(dbMaterials.map(d => d.name.toLowerCase().trim()))
    const additional = mockMapped.filter(m => !existingNames.has(m.name.toLowerCase().trim()))
    allMaterials = [...dbMaterials, ...additional]
  } else {
    allMaterials = mockMapped
  }

  // Apply in-memory filters for merged/mock items
  let filtered = allMaterials
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(m => m.category === filters.category)
  }
  if (filters.origin && filters.origin !== 'all') {
    filtered = filtered.filter(m => m.origin.toLowerCase().includes(filters.origin!.toLowerCase()))
  }
  if (filters.quality && filters.quality !== 'all') {
    filtered = filtered.filter(m => m.quality === filters.quality)
  }
  if (filters.inStockOnly) {
    filtered = filtered.filter(m => m.inStock)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
  }
  if (filters.sort) {
    if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price)
    else if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price)
    else if (filters.sort === 'min-order') filtered.sort((a, b) => a.minOrderQty - b.minOrderQty)
  }

  return filtered
}

export async function fetchRawMaterialById(id: string): Promise<RawMaterial | null> {
  const { data, error } = await supabase.from('raw_materials').select('*, material_suppliers(*)').eq('id', id).maybeSingle()
  if (!error && data) return mapRawMaterial(data)
  
  const mock = RAW_MATERIALS.find(m => m.id === id)
  if (mock) {
    return {
      ...mock,
      images: getAuthoritativeRawMaterialImages(mock.id, mock.name, mock.images)
    }
  }
  return null
}

export async function submitBulkRequest(form: BulkRequestForm): Promise<{ referenceNo: string }> {
  const refNo = 'BR' + Math.random().toString().slice(2, 10)
  const { error } = await supabase.from('bulk_requests').insert({
    reference_no: refNo,
    material_id: form.materialId,
    material_name: form.materialName,
    requested_qty: form.requestedQty,
    unit: form.unit,
    artisan_name: form.artisanName,
    organization_name: form.organizationName,
    email: form.email,
    phone: form.phone,
    notes: form.notes,
    color_shade_ref: form.colorShadeRef
  })
  if (error) throw error
  return { referenceNo: refNo }
}
