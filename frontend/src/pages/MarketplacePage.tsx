import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopHero } from '../components/shop/ShopHero'
import { CategoryNav } from '../components/shop/CategoryNav'
import { ShopFiltersSidebar, MobileFilterButton, MobileFilterDrawer, SortDropdown } from '../components/shop/ShopFilters'
import { ProductGrid } from '../components/shop/ProductGrid'
import { QuickViewModal } from '../components/shop/QuickViewModal'
import { RegionDiscovery } from '../components/shop/RegionDiscovery'
import { useShopState } from '../hooks/useShopState'
import { useCart } from '../hooks/useCart'
import { fetchCategories, fetchFacets, type ProductFacets } from '../services/productService'
import type { ShopProduct, ShopCategory } from '../types/shopTypes'

export function MarketplacePage() {
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const urlCategory = searchParams.get('category') || ''

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null)
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [facets, setFacets] = useState<ProductFacets | undefined>(undefined)
  const [isLoadingFacets, setIsLoadingFacets] = useState<boolean>(true)

  const productsSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategories(data)
        }
      } catch (err) {
        console.warn('[MarketplacePage] Failed to fetch categories from API:', err)
      }
    }
    loadCategories()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    fetchFacets()
      .then(data => {
        if (isMounted && data) {
          setFacets(data)
        }
      })
      .catch(err => {
        console.warn('[MarketplacePage] Failed to fetch facets from API:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoadingFacets(false)
      })
    return () => { isMounted = false }
  }, [])

  const {
    filters,
    updateFilter,
    resetFilters,
    toggleArrayFilter,
    products,
    totalCount,
    hasMore,
    loadMore,
    activeFilterCount,
  } = useShopState(undefined, {
    search: urlSearch,
    category: urlCategory || 'all'
  })

  // Synchronize filter when URL search parameter changes
  useEffect(() => {
    if (urlSearch !== filters.search) {
      updateFilter('search', urlSearch)
    }
  }, [urlSearch, updateFilter])

  useEffect(() => {
    if (urlCategory && urlCategory !== filters.category) {
      updateFilter('category', urlCategory)
    }
  }, [urlCategory, updateFilter])

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    isInCart,
  } = useCart()

  const handleSelectCategory = (catId: string) => {
    updateFilter('category', catId)
  }

  const handleSelectRegion = (regionName: string) => {
    updateFilter('regions', [regionName])
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="marketplace-page" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>
      {/* Shop Hero */}
      <ShopHero
        searchValue={filters.search}
        onSearchChange={val => updateFilter('search', val)}
        totalProducts={totalCount}
      />

      {/* Category Navigation Bar */}
      <CategoryNav
        categories={categories}
        activeCategory={filters.category}
        onSelect={handleSelectCategory}
      />

      {/* Main Shop Layout: Sidebar + Grid */}
      <section className="section-pad" ref={productsSectionRef} style={{ paddingTop: '40px' }}>
        <div className="container">
          {/* Toolbar above grid on desktop/mobile */}
          <div className="product-grid__toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MobileFilterButton
                activeFilterCount={activeFilterCount}
                onClick={() => setMobileFilterOpen(true)}
              />
              <span className="product-grid__count">
                Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> products
              </span>
            </div>

            <SortDropdown
              value={filters.sort}
              onChange={val => updateFilter('sort', val)}
            />
          </div>

          <div className="shop-layout">
            {/* Desktop Filters Sidebar */}
            <ShopFiltersSidebar
              filters={filters}
              updateFilter={updateFilter}
              toggleArrayFilter={toggleArrayFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              facets={facets}
              isLoadingFacets={isLoadingFacets}
            />

            {/* Product Grid */}
            <ProductGrid
              products={products}
              totalCount={totalCount}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isWishlisted={isInWishlist}
              isInCart={isInCart}
              onToggleWishlist={toggleWishlist}
              onAddToCart={id => addToCart(id, 1)}
              onQuickView={p => setQuickViewProduct(p)}
            />
          </div>
        </div>
      </section>

      {/* Region Discovery */}
      <RegionDiscovery onSelectRegion={handleSelectRegion} />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        updateFilter={updateFilter}
        toggleArrayFilter={toggleArrayFilter}
        resetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
        facets={facets}
        isLoadingFacets={isLoadingFacets}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(id, qty) => addToCart(id, qty)}
        isInCart={quickViewProduct ? isInCart(quickViewProduct.id) : false}
      />
    </div>
  )
}
