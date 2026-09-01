import { Link } from 'react-router-dom'
import { Icon } from '../primitives/Icon'
import type { ShopProduct } from '../../types/shopTypes'
import { getArtisanById } from '../../utils/mocks/shopData'

interface ProductCardProps {
  product: ShopProduct
  isWishlisted: boolean
  isInCart: boolean
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string) => void
  onQuickView: (product: ShopProduct) => void
}

const BADGE_CLASS: Record<string, string> = {
  New: 'product-card__badge--new',
  Bestseller: 'product-card__badge--bestseller',
  Limited: 'product-card__badge--limited',
  Handwoven: 'product-card__badge--handwoven',
}

export function ProductCard({ product, isWishlisted, isInCart, onToggleWishlist, onAddToCart, onQuickView }: ProductCardProps) {
  const artisan = getArtisanById(product.artisanId)

  return (
    <article className="product-card">
      <Link
        to={`/marketplace/${product.slug}`}
        className="product-card__image-wrap"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={product.alt}
          className="product-card__image"
          loading="lazy"
        />
        {product.badge && (
          <span className={`product-card__badge ${BADGE_CLASS[product.badge] || ''}`}>
            {product.badge}
          </span>
        )}
      </Link>

      {/* Hover action buttons */}
      <div className="product-card__actions">
        <button
          className={`product-card__action-btn ${isWishlisted ? 'product-card__action-btn--wishlisted' : ''}`}
          onClick={e => { e.preventDefault(); onToggleWishlist(product.id) }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon name={isWishlisted ? 'heart-filled' : 'heart'} size={16} />
        </button>
        <button
          className="product-card__action-btn"
          onClick={e => { e.preventDefault(); onQuickView(product) }}
          aria-label="Quick view"
        >
          <Icon name="eye" size={16} />
        </button>
      </div>

      {/* Add to cart bar */}
      <div className="product-card__cart-bar">
        <button
          className={`product-card__add-cart ${isInCart ? 'product-card__add-cart--added' : ''}`}
          onClick={e => { e.preventDefault(); onAddToCart(product.id) }}
        >
          {isInCart ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>

      <div className="product-card__body">
        <span className="product-card__region">{product.region}</span>
        <Link to={`/marketplace/${product.slug}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>
        <span className="product-card__meta">{product.material}</span>
        <div className="product-card__footer">
          <span className="product-card__price">{product.displayPrice}</span>
          {artisan && <span className="product-card__artisan">{artisan.name}</span>}
        </div>
      </div>
    </article>
  )
}
