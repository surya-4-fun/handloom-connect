import { useState, useRef } from 'react'
import { ShopHero } from '../components/shop/ShopHero'
import { CategoryNav } from '../components/shop/CategoryNav'
import { ShopFiltersSidebar, MobileFilterButton, MobileFilterDrawer, SortDropdown } from '../components/shop/ShopFilters'
import { ProductGrid } from '../components/shop/ProductGrid'
import { QuickViewModal } from '../components/shop/QuickViewModal'
import { RegionDiscovery } from '../components/shop/RegionDiscovery'
import { useShopState } from '../hooks/useShopState'
import { useCart } from '../hooks/useCart'
import { getCategoriesWithCounts } from '../mocks/shopData'
import type { ShopProduct } from '../types/shopTypes'

export function MarketplacePage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null)

  const productsSectionRef = useRef<HTMLDivElement>(null)

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
  } = useShopState()

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    isInCart,
  } = useCart()

  const categories = getCategoriesWithCounts()

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
