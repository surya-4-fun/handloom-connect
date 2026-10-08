import { useState, useMemo, useCallback, useEffect } from 'react'
import type { ShopProduct, ShopFilters, SortOption } from '../types/shopTypes'
import { DEFAULT_FILTERS } from '../types/shopTypes'
import { fetchProducts } from '../services/productService'

const ITEMS_PER_PAGE = 12

function matchesSearch(product: ShopProduct, query: string): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return true
  return (
    (product.name ? product.name.toLowerCase().includes(q) : false) ||
    (product.category ? product.category.toLowerCase().includes(q) : false) ||
    (product.material ? product.material.toLowerCase().includes(q) : false) ||
    (product.region ? product.region.toLowerCase().includes(q) : false) ||
    (product.technique ? product.technique.toLowerCase().includes(q) : false) ||
    (product.description ? product.description.toLowerCase().includes(q) : false) ||
    (product.provenance ? product.provenance.toLowerCase().includes(q) : false)
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

export function useShopState(
  initialProducts: ShopProduct[] = [],
  initialFilters?: Partial<ShopFilters>
) {
  const [allProducts, setAllProducts] = useState<ShopProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<ShopFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters
  }))
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)

  // Debounce search filter input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search)
    }, 250)
    return () => clearTimeout(timer)
  }, [filters.search])

  // Fetch real products from backend API
  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const activeFilters = {
          ...filters,
          search: debouncedSearch.trim()
        }
        const res = await fetchProducts(activeFilters)
        if (isMounted && res && Array.isArray(res.products)) {
          setAllProducts(res.products)
        }
      } catch (err) {
        console.warn('[useShopState] Error loading products from API:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProducts()
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.category,
    filters.sort,
    filters.inStockOnly,
    filters.priceRange,
    filters.materials,
    filters.regions,
    filters.techniques,
    filters.artisanIds,
    debouncedSearch
  ])

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
    let results = allProducts

    // Category
    if (filters.category && filters.category !== 'all') {
      const catVal = filters.category.toLowerCase()
      results = results.filter(p => {
        if (p.categoryId && p.categoryId.toLowerCase() === catVal) return true
        if (p.category && p.category.toLowerCase() === catVal) return true
        return false
      })
    }

    // Search (Immediate client-side filtering for fast responsive feedback)
    if (filters.search && filters.search.trim()) {
      results = results.filter(p => matchesSearch(p, filters.search))
    }

    // Price range
    if (filters.priceRange) {
      results = results.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    }

    // Materials
    if (filters.materials && filters.materials.length > 0) {
      results = results.filter(p => filters.materials.some(m => p.material.toLowerCase().includes(m.toLowerCase())))
    }

    // Regions
    if (filters.regions && filters.regions.length > 0) {
      results = results.filter(p => filters.regions.some(r => p.region.toLowerCase().includes(r.toLowerCase())))
    }

    // Techniques
    if (filters.techniques && filters.techniques.length > 0) {
      results = results.filter(p => filters.techniques.some(t => p.technique.toLowerCase().includes(t.toLowerCase())))
    }

    // In stock
    if (filters.inStockOnly) {
      results = results.filter(p => p.inStock)
    }

    // Sort
    results = sortProducts(results, filters.sort)

    return results
  }, [allProducts, filters])

  const visibleProducts = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length
  const totalCount = filtered.length

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filtered.length))
  }, [filtered.length])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category && filters.category !== 'all') count++
    if (filters.materials && filters.materials.length > 0) count++
    if (filters.regions && filters.regions.length > 0) count++
    if (filters.techniques && filters.techniques.length > 0) count++
    if (filters.inStockOnly) count++
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000)) count++
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
    isLoading,
  }
}
