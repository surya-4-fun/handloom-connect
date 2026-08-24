export type RawMaterialCategory =
  | 'Silk Yarn'
  | 'Cotton Yarn'
  | 'Wool'
  | 'Natural Dyes'
  | 'Indigo'
  | 'Weaving Materials'
  | 'Craft Accessories'

export type MaterialQuality =
  | 'Grade AAA Pure'
  | 'Certified Organic'
  | 'Hand-spun Artisan'
  | 'Pure Metallic'

export interface MaterialSupplier {
  id: string
  name: string
  location: string
  rating: number
  certified: boolean
  verifiedGI: boolean
  specialty: string
  contactEmail: string
}

export interface RawMaterial {
  id: string
  name: string
  category: RawMaterialCategory
  materialType: string
  origin: string
  supplier: MaterialSupplier
  quality: MaterialQuality
  quantityUnit: string
  price: number
  displayPrice: string
  minOrderQty: number
  inStock: boolean
  sustainabilityInfo: string
  description: string
  images: string[]
  badge?: 'Artisan Grade' | 'Organic Vat' | 'Direct Guild' | 'GI Certified'
  denierOrCount?: string
}

export interface RawMaterialFilters {
  category: string
  search: string
  origin: string
  quality: string
  priceRange: [number, number]
  inStockOnly: boolean
  sort: 'featured' | 'price-asc' | 'price-desc' | 'min-order'
}

export interface BulkRequestForm {
  materialId: string
  materialName: string
  requestedQty: number
  unit: string
  artisanName: string
  organizationName: string
  email: string
  phone: string
  notes: string
  colorShadeRef?: string
}
