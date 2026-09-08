import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../primitives/Icon'
import { Button } from '../primitives/Button'
import type { ShopProduct } from '../../types/shopTypes'

interface QuickViewModalProps {
  product: ShopProduct | null
  onClose: () => void
  onAddToCart: (productId: string, quantity: number) => void
  isInCart: boolean
}

export function QuickViewModal({ product, onClose, onAddToCart, isInCart }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(1)
  }, [product])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (product) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  const artisanName = product.artisanName || product.artisan?.name

  const handleAdd = () => {
    onAddToCart(product.id, quantity)
  }

  return (
    <div className="quick-view-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="quick-view" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="quick-view__close" onClick={onClose} aria-label="Close modal">
          <Icon name="x" size={18} />
        </button>

        <div className="quick-view__image-wrap">
          <img src={product.images[0]} alt={product.alt} className="quick-view__image" />
        </div>

        <div className="quick-view__body">
          <span className="quick-view__craft">{product.technique} · {product.region}</span>
          <h2 className="quick-view__name">{product.name}</h2>
          <div className="quick-view__price">{product.displayPrice}</div>
          <p className="quick-view__desc">{product.description}</p>

          <div className="quick-view__detail-row">
            <div className="quick-view__detail">
              <span className="quick-view__detail-label">Material</span>
              <span className="quick-view__detail-value">{product.material}</span>
            </div>
            {artisanName && (
              <div className="quick-view__detail">
                <span className="quick-view__detail-label">Artisan</span>
                <span className="quick-view__detail-value">{artisanName}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Quantity:
            </span>
            <div className="qty-selector">
              <button
                className="qty-selector__btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Icon name="minus" size={14} />
              </button>
              <span className="qty-selector__value">{quantity}</span>
              <button
                className="qty-selector__btn"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
              >
                <Icon name="plus" size={14} />
              </button>
            </div>
          </div>

          <div className="quick-view__actions">
            <Button variant="primary" onClick={handleAdd}>
              {isInCart ? 'Add More to Cart' : 'Add to Cart'}
            </Button>
            <Link
              to={`/marketplace/${product.slug}`}
              className="button button--secondary"
              onClick={onClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
