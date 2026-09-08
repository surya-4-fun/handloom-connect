/* ─── Shop Domain Types ──────────────────────────────────────────────
   Designed so mock data can be replaced by Express/MySQL API responses
   without changing component interfaces.
──────────────────────────────────────────────────────────────────── */

export interface ShopArtisan {
  id: string
  name: string
  title?: string
  region: string
  craft: string
  specialty?: string
  experience: string
  bio: string
  story?: string
  techniques?: string[]
  culturalBackground?: string
  communityImpact?: {
    activeLooms: number
    fairWagePercentage: number
    apprenticesTrained: number
    summary: string
  }
  image: string
  isFeatured?: boolean
  isCollective?: boolean
  followerCount?: number
  supportCount?: number
}

export interface ShopProduct {
  id: string
  name: string
  slug: string
  category: string
  price: number
  /** Pre-formatted display price, e.g. "₹4,800" */
  displayPrice: string
  images: string[]
  alt: string
  material: string
  region: string
  technique: string
  artisanId: string
  artisanName?: string
  artisan?: Partial<ShopArtisan>
  description: string
  dimensions?: string
  care?: string
  provenance?: string
  badge?: 'New' | 'Bestseller' | 'Limited' | 'Handwoven'
  inStock: boolean
}

export interface ShopCategory {
  id: string
  label: string
  count: number
  image: string
}

export interface ShopRegion {
  id: string
  name: string
  state: string
  crafts: string[]
  image: string
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'popular'

export interface ShopFilters {
  category: string
  priceRange: [number, number]
  materials: string[]
  regions: string[]
  techniques: string[]
  artisanIds: string[]
  inStockOnly: boolean
  search: string
  sort: SortOption
}

export const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  newest: 'Newest',
  'price-asc': 'Price: Low → High',
  'price-desc': 'Price: High → Low',
  popular: 'Popular',
}

export const DEFAULT_FILTERS: ShopFilters = {
  category: 'all',
  priceRange: [0, 100000],
  materials: [],
  regions: [],
  techniques: [],
  artisanIds: [],
  inStockOnly: false,
  search: '',
  sort: 'featured',
}
