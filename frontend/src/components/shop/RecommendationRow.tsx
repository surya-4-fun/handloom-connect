import type { ShopProduct } from '../../types/shopTypes'
import { ProductCard } from './ProductCard'

interface RecommendationRowProps {
  title: string
  subtitle?: string
  products: ShopProduct[]
  isWishlisted: (id: string) => boolean
  isInCart: (id: string) => boolean
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string) => void
  onQuickView: (product: ShopProduct) => void
}

export function RecommendationRow({
  title,
  subtitle,
  products,
  isWishlisted,
  isInCart,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}: RecommendationRowProps) {
  if (products.length === 0) return null

  return (
    <section className="recommendation-row" aria-label={title}>
      <div className="container">
        <div className="recommendation-row__header">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--ink)', margin: 0 }}>
              {title}
            </h3>
            {subtitle && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>{subtitle}</p>}
          </div>
        </div>

        <div className="recommendation-row__scroll">
          {products.slice(0, 4).map(product => (
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
      </div>
    </section>
  )
}
