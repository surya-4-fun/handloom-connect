import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { ProductCard } from '../components/shop/ProductCard'
import { SHOP_ARTISANS, SHOP_PRODUCTS } from '../mocks/shopData'
import { useFollowArtisans } from '../hooks/useFollowArtisans'
import { useCart } from '../hooks/useCart'

export function ArtisanDetailPage() {
  const { artisanId } = useParams<{ artisanId: string }>()
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useFollowArtisans()
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useCart()

  const [showSupportModal, setShowSupportModal] = useState(false)
  const [selectedSupportTier, setSelectedSupportTier] = useState<number>(1200)
  const [supportConfirmed, setSupportConfirmed] = useState(false)

  const artisan = useMemo(() => {
    return SHOP_ARTISANS.find(a => a.id === artisanId) || SHOP_ARTISANS[0]
  }, [artisanId])

  const artisanProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter(p => p.artisanId === artisan.id)
  }, [artisan.id])

  const following = isFollowing(artisan.id)

  const handleSupportConfirm = () => {
    setSupportConfirmed(true)
    setTimeout(() => {
      setSupportConfirmed(false)
      setShowSupportModal(false)
    }, 2400)
  }

  return (
    <div className="artisan-detail-page">
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/artisans" style={{ color: 'var(--muted)' }}>Artisans</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{artisan.name}</span>
        </div>

        {/* Hero Card Showcase */}
        <div className="artisan-hero-card">
          <div className="artisan-portrait-wrapper">
            <img src={artisan.image} alt={artisan.name} className="artisan-portrait-img" />
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.1em', fontWeight: 700 }}>
              {artisan.isCollective ? 'ARTISAN GUILD' : 'MASTER WEAVER'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p className="eyebrow" style={{ color: 'var(--gold)' }}>{artisan.region}</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', margin: '4px 0 8px', fontWeight: 400 }}>
                {artisan.name}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--brand)', fontWeight: 600, marginBottom: '16px' }}>
                {artisan.title || artisan.craft}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '680px', marginBottom: '24px' }}>
                {artisan.bio}
              </p>

              {/* Badges / Specialty Row */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 16px' }}>
                  <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Experience</small>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>{artisan.experience}</strong>
                </div>
                <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 16px' }}>
                  <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Specialization</small>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>{artisan.specialty || artisan.craft}</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" onClick={() => setShowSupportModal(true)}>
                🎁 Support This Artisan
              </Button>
              <Button
                variant={following ? 'secondary' : 'ghost'}
                onClick={() => toggleFollow(artisan.id)}
                style={{ borderColor: following ? 'var(--gold)' : 'var(--border)', color: following ? 'var(--gold)' : 'var(--ink)' }}
              >
                <Icon name={following ? 'heart-filled' : 'heart'} size={18} />
                {following ? 'Following Artisan' : 'Follow Weaver'}
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Story & Lineage Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '40px', marginBottom: '60px' }}>
          
          {/* Story Content */}
          <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0 0 16px', fontWeight: 400 }}>
              Craft Heritage & Master Story
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '24px' }}>
              {artisan.story || artisan.bio}
            </p>

            {/* Techniques List */}
            {artisan.techniques && artisan.techniques.length > 0 && (
              <div>
                <h4 style={{ color: 'var(--gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                  Master Loom Techniques
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {artisan.techniques.map(tech => (
                    <span key={tech} className="technique-pill">
                      ✨ {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cultural Background & Community Impact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Cultural Recognition Card */}
            <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '0 0 12px', fontWeight: 400 }}>
                📜 Cultural Lineage
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                {artisan.culturalBackground || 'Certified Government Registered Artisan with Geographical Indication (GI Tag) provenance protection.'}
              </p>
            </div>

            {/* Impact Metrics Card */}
            {artisan.communityImpact && (
              <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '0 0 16px', fontWeight: 400 }}>
                  🌱 Community Impact
                </h3>
                <div className="impact-metrics-grid">
                  <div className="impact-metric-card">
                    <div className="impact-metric-value">{artisan.communityImpact.activeLooms}</div>
                    <div className="impact-metric-label">Active Looms</div>
                  </div>
                  <div className="impact-metric-card">
                    <div className="impact-metric-value">{artisan.communityImpact.fairWagePercentage}%</div>
                    <div className="impact-metric-label">Direct Trade</div>
                  </div>
                  <div className="impact-metric-card">
                    <div className="impact-metric-value">{artisan.communityImpact.apprenticesTrained}</div>
                    <div className="impact-metric-label">Apprentices</div>
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '12px 0 0', lineHeight: 1.5 }}>
                  {artisan.communityImpact.summary}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Products Woven by Artisan Section */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div>
              <p className="eyebrow" style={{ color: 'var(--gold)' }}>Direct Loom Creations</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: 0, fontWeight: 400 }}>
                Textiles Woven by {artisan.name} ({artisanProducts.length})
              </h2>
            </div>
            <Link to="/marketplace" style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline' }}>
              Explore Full Marketplace →
            </Link>
          </div>

          {artisanProducts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--canvas-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)', margin: 0 }}>All current commissions for this artisan are sold out. Check back soon for new loom releases!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {artisanProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => navigate(`/marketplace/${product.slug}`)}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(product.id)}
                  isInCart={isInCart(product.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Support Artisan Interactive Modal */}
      {showSupportModal && (
        <div className="support-modal-backdrop">
          <div className="support-modal-card">
            
            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--ink)', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            {supportConfirmed ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌺</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)', margin: '0 0 8px' }}>
                  Craft Gratitude Recorded!
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Thank you for supporting traditional handloom heritage. You are now following craft updates and loom releases from <strong>{artisan.name}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Direct Craft Connection
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '4px 0 6px', fontWeight: 400 }}>
                    Support & Connect with {artisan.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                    Choose how you would like to connect with and honor this master weaver.
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div
                    className={`support-tier-option ${selectedSupportTier === 500 ? 'selected' : ''}`}
                    onClick={() => setSelectedSupportTier(500)}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>🌺 Send Digital Craft Gratitude</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Send a personal message of appreciation to the artisan family.</span>
                    </div>
                  </div>

                  <div
                    className={`support-tier-option ${selectedSupportTier === 1200 ? 'selected' : ''}`}
                    onClick={() => setSelectedSupportTier(1200)}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>🧵 Follow Loom Journey Updates</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Receive notifications when {artisan.name} completes new woven pieces.</span>
                    </div>
                  </div>

                  <div
                    className={`support-tier-option ${selectedSupportTier === 2500 ? 'selected' : ''}`}
                    onClick={() => setSelectedSupportTier(2500)}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>🎓 Share Craft Story with Friends</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Help preserve handloom heritage by sharing this artisan&apos;s story.</span>
                    </div>
                  </div>
                </div>

                <Button variant="gold" onClick={handleSupportConfirm} style={{ width: '100%', textAlign: 'center' }}>
                  Confirm Connection & Support
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
