import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { ArtisanStrip } from '../components/shop/ArtisanStrip'
import { RecommendationRow } from '../components/shop/RecommendationRow'
import { QuickViewModal } from '../components/shop/QuickViewModal'
import { useCart } from '../hooks/useCart'
import { SHOP_PRODUCTS, getArtisanById } from '../mocks/shopData'
import type { ShopProduct } from '../types/shopTypes'
import { QRCodeView } from '../components/primitives/QRCodeView'
import { getAuthenticityPassport } from '../services/authenticityService'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const product = useMemo(() => {
    return SHOP_PRODUCTS.find(p => p.slug === productId || p.id === productId)
  }, [productId])

  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null)
  const [showJourneyModal, setShowJourneyModal] = useState(false)

  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useCart()

  if (!product) {
    return (
      <div className="section-pad" style={{ textAlign: 'center', minHeight: '60vh', background: 'var(--canvas)', color: 'var(--ink)' }}>
        <div className="container" style={{ padding: '80px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '16px' }}>Product Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>The handcrafted piece you are looking for may have been retired or moved.</p>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const artisan = getArtisanById(product.artisanId)
  const passport = useMemo(() => getAuthenticityPassport(product), [product])

  const relatedProducts = SHOP_PRODUCTS.filter(
    p => p.id !== product.id && (p.category === product.category || p.region === product.region)
  )

  const wishlisted = isInWishlist(product.id)
  const inCart = isInCart(product.id)

  return (
    <div className="pdp" style={{ background: 'var(--canvas)', color: 'var(--ink)' }}>
      <div className="container">
        {/* Breadcrumb navigation */}
        <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="pdp__breadcrumb-sep">/</span>
          <Link to="/marketplace">Shop</Link>
          <span className="pdp__breadcrumb-sep">/</span>
          <Link to={`/marketplace?category=${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="pdp__breadcrumb-sep">/</span>
          <span style={{ color: 'var(--ink)' }}>{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="pdp__main">
          {/* Image Gallery */}
          <div className="pdp__gallery">
            <div className="pdp__gallery-main">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.alt}
              />
            </div>
            {product.images.length > 1 && (
              <div className="pdp__gallery-thumbs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pdp__gallery-thumb ${idx === activeImageIdx ? 'pdp__gallery-thumb--active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Actions */}
          <div className="pdp__info">
            <span className="pdp__craft-badge">
              <Icon name="sparkles" size={12} />
              {product.technique}
            </span>

            <h1 className="pdp__name">{product.name}</h1>

            <div className="pdp__price">{product.displayPrice}</div>

            {product.provenance && (
              <div className="pdp__provenance">
                <Icon name="shield" size={16} />
                <span>Provenance: {product.provenance}</span>
              </div>
            )}

            <p className="pdp__desc">{product.description}</p>

            {/* Specification Grid */}
            <div className="pdp__specs">
              <div>
                <span className="pdp__spec-label">Material</span>
                <span className="pdp__spec-value">{product.material}</span>
              </div>
              <div>
                <span className="pdp__spec-label">Region</span>
                <span className="pdp__spec-value">{product.region}</span>
              </div>
              <div>
                <span className="pdp__spec-label">Technique</span>
                <span className="pdp__spec-value">{product.technique}</span>
              </div>
              {product.dimensions && (
                <div>
                  <span className="pdp__spec-label">Dimensions</span>
                  <span className="pdp__spec-value">{product.dimensions}</span>
                </div>
              )}
              {product.care && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span className="pdp__spec-label">Care Instructions</span>
                  <span className="pdp__spec-value">{product.care}</span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
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

            <div className="pdp__actions">
              <Button
                variant="primary"
                onClick={() => addToCart(product.id, quantity)}
              >
                {inCart ? '✓ In Cart (Add More)' : 'Add to Cart'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => toggleWishlist(product.id)}
              >
                <Icon name={wishlisted ? 'heart-filled' : 'heart'} size={16} />
                {wishlisted ? 'Saved to Wishlist' : 'Wishlist'}
              </Button>
            </div>

            {/* Artisan Connection */}
            {artisan && (
              <div style={{ marginTop: '24px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                  Artisan Provenance Lineage
                </span>

                {/* Provenance Chain Hierarchy */}
                <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--ink)' }}>{product.name}</strong>
                    <span>→</span>
                    <Link to={`/artisans/${artisan.id}`} style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'underline' }}>{artisan.name}</Link>
                    <span>→</span>
                    <span style={{ color: 'var(--ink)' }}>{product.region}</span>
                    <span>→</span>
                    <span style={{ color: 'var(--ink)' }}>{product.category}</span>
                    <span>→</span>
                    <span style={{ color: 'var(--brand)' }}>{product.technique}</span>
                  </div>
                </div>

                <ArtisanStrip artisan={artisan} />
              </div>
            )}

            {/* Authenticity Passport & QR Story Card */}
            <div className="authenticity-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="shield" size={14} /> Provenance Certificate
                </span>
                <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>
                  ✓ {passport.verificationStatus}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0 0 8px', fontWeight: 400 }}>
                Authenticity & Heritage Guarantee
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 12px', lineHeight: 1.5 }}>
                GI Registry: <strong>{passport.giRegistryNo}</strong> • Silk Mark: <strong>{passport.silkMarkNo}</strong>
              </p>

              {/* Checklist */}
              <div className="authenticity-badges-row">
                <span className="authenticity-badge-item certified">✓ Artisan Crafted</span>
                <span className="authenticity-badge-item certified">✓ Pit Loom Handwoven</span>
                <span className="authenticity-badge-item certified">✓ Origin Verified</span>
                <span className="authenticity-badge-item certified">✓ GI Craft Association</span>
              </div>

              {/* QR Code Scan Container */}
              <div className="qr-card-container">
                <QRCodeView value={`${window.location.origin}/story/${product.slug || product.id}`} size={90} />
                <div style={{ flexGrow: 1 }}>
                  <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--ink)' }}>Scan or Explore QR Craft Story</strong>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '4px 0 10px' }}>
                    Access full production journey, artisan voice notes, and digital certificate passport.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/story/${product.slug || product.id}`} className="button button--secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                      Open QR Story Page →
                    </Link>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => setShowJourneyModal(true)}
                      style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'var(--border)' }}
                    >
                      View 6-Stage Journey
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Recommendation Row */}
        <RecommendationRow
          title="You May Also Like"
          subtitle={`Handcrafted pieces from ${product.region} and similar techniques`}
          products={relatedProducts}
          isWishlisted={isInWishlist}
          isInCart={isInCart}
          onToggleWishlist={toggleWishlist}
          onAddToCart={id => addToCart(id, 1)}
          onQuickView={p => setQuickViewProduct(p)}
        />
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(id, qty) => addToCart(id, qty)}
        isInCart={quickViewProduct ? isInCart(quickViewProduct.id) : false}
      />

      {/* 6-Stage Craft Journey Modal */}
      {showJourneyModal && (
        <div className="support-modal-backdrop">
          <div className="support-modal-card" style={{ maxWidth: '640px' }}>
            <button
              type="button"
              onClick={() => setShowJourneyModal(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--ink)', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Traceable Handloom Creation
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '4px 0 6px', fontWeight: 400 }}>
                Craft Production Journey
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                {product.name} ({passport.authenticityId})
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
              {passport.craftJourney.map(stg => (
                <div key={stg.stageNumber} style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>Stage {stg.stageNumber}: {stg.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ Verified</span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--muted)' }}>{stg.description}</p>
                  {stg.weaverNote && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink)', fontStyle: 'italic' }}>
                      💬 Weaver Note: &quot;{stg.weaverNote}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <Button variant="gold" onClick={() => { setShowJourneyModal(false); navigate('/order-tracking?id=HC-2026-8942'); }} style={{ flex: 1, textAlign: 'center' }}>
                Track Live Loom Commissions →
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
