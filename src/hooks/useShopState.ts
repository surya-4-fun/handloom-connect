import { useState, useMemo, useCallback } from 'react'
import type { ShopProduct, ShopFilters, SortOption } from '../types/shopTypes'
import { DEFAULT_FILTERS } from '../types/shopTypes'
import { SHOP_PRODUCTS } from '../mocks/shopData'

const ITEMS_PER_PAGE = 12

function matchesSearch(product: ShopProduct, query: string): boolean {
  const q = query.toLowerCase()
  return (
    product.name.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.material.toLowerCase().includes(q) ||
    product.region.toLowerCase().includes(q) ||
    product.technique.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q)
  )
}

function sortProducts(products: ShopProduct[], sort: SortOption): ShopProduct[] {
  const copy = [...products]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'newest':
      return copy.reverse()
    case 'popular':
      return copy.sort((a, b) => (b.badge === 'Bestseller' ? 1 : 0) - (a.badge === 'Bestseller' ? 1 : 0))
    case 'featured':
    default:
      return copy
  }
}

export function useShopState(initialProducts: ShopProduct[] = SHOP_PRODUCTS) {
  const [filters, setFilters] = useState<ShopFilters>({ ...DEFAULT_FILTERS })
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const updateFilter = useCallback(<K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS })
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const toggleArrayFilter = useCallback(<K extends 'materials' | 'regions' | 'techniques' | 'artisanIds'>(
    key: K,
    value: string,
  ) => {
    setFilters(prev => {
      const arr = prev[key] as string[]
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return { ...prev, [key]: next }
    })
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const filtered = useMemo(() => {
    let results = initialProducts

    // Category
    if (filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category)
    }

    // Search
    if (filters.search.trim()) {
      results = results.filter(p => matchesSearch(p, filters.search))
    }

    // Price range
    results = results.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])

    // Materials
    if (filters.materials.length > 0) {
      results = results.filter(p => filters.materials.some(m => p.material.includes(m)))
    }

    // Regions
    if (filters.regions.length > 0) {
      results = results.filter(p => filters.regions.some(r => p.region.includes(r)))
    }

    // Techniques
    if (filters.techniques.length > 0) {
      results = results.filter(p => filters.techniques.some(t => p.technique.includes(t)))
    }

    // In stock
    if (filters.inStockOnly) {
      results = results.filter(p => p.inStock)
    }

    // Sort
    results = sortProducts(results, filters.sort)

    return results
  }, [initialProducts, filters])

  const visibleProducts = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length
  const totalCount = filtered.length

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filtered.length))
  }, [filtered.length])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'all') count++
    if (filters.materials.length > 0) count++
    if (filters.regions.length > 0) count++
    if (filters.techniques.length > 0) count++
    if (filters.inStockOnly) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++
    return count
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    toggleArrayFilter,
    products: visibleProducts,
    totalCount,
    hasMore,
    loadMore,
    activeFilterCount,
  }
}
