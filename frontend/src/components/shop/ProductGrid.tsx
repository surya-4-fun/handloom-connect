import { Icon } from '../primitives/Icon'
import { Button } from '../primitives/Button'
import type { ShopProduct } from '../../types/shopTypes'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: ShopProduct[]
  totalCount: number
  hasMore: boolean
  onLoadMore: () => void
  isWishlisted: (id: string) => boolean
  isInCart: (id: string) => boolean
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string) => void
  onQuickView: (product: ShopProduct) => void
}

export function ProductGrid({
  products,
  totalCount,
  hasMore,
  onLoadMore,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}: ProductGridProps) {
  if (totalCount === 0) {
    return (
      <div className="shop-empty">
        <Icon name="search" size={48} className="shop-empty__icon" />
        <h3 className="shop-empty__title">No products found</h3>
        <p className="shop-empty__text">
          Try adjusting your filters or search terms to discover more handcrafted pieces.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="product-grid__items">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={isWishlisted(product.id)}
            isInCart={isInCart(product.id)}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      {hasMore && (
        <div className="product-grid__load-more">
          <Button variant="secondary" onClick={onLoadMore}>
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}
