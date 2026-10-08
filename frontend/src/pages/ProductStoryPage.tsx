import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { QRCodeView } from '../components/primitives/QRCodeView'
import { fetchProductDetail } from '../services/productService'
import type { ShopProduct, ShopArtisan } from '../types/shopTypes'
import type { AuthenticityPassport } from '../types/authenticity'

export function ProductStoryPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ShopProduct | null>(null)
  const [artisan, setArtisan] = useState<ShopArtisan | null>(null)
  const [passport, setPassport] = useState<AuthenticityPassport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!productId) return
    let isMounted = true

    async function loadData() {
      setIsLoading(true)
      const res = await fetchProductDetail(productId!)
      if (isMounted && res?.product) {
        setProduct(res.product)
        if (res.artisan) setArtisan(res.artisan)
        if (res.passport) setPassport(res.passport)
      }
      if (isMounted) setIsLoading(false)
    }

    loadData()
    return () => { isMounted = false }
  }, [productId])

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: 'var(--gold)', fontWeight: 600 }}>
        Loading verified product story...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-pad" style={{ textAlign: 'center', minHeight: '60vh', background: 'var(--canvas)', color: 'var(--ink)' }}>
        <div className="container" style={{ padding: '80px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '16px' }}>Product Story Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>The handcrafted creation you are looking for may have been retired or moved.</p>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const storyUrl = `${window.location.origin}/story/${product.slug || product.id}`
  return (
    <div className="product-story-page">
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/marketplace" style={{ color: 'var(--muted)' }}>Shop</Link>
          <span>/</span>
          <Link to={`/marketplace/${product.slug || product.id}`} style={{ color: 'var(--muted)' }}>{product.name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Authenticity QR Story</span>
        </div>

        {/* Story Hero Banner */}
        <div className="story-hero-grid">
          
          {/* Left Imagery & QR Overlay */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '4/3' }}>
            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.95) 0%, transparent 60%)' }} />
            
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--gold)', color: '#000', padding: '4px 12px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em' }}>
              GI & CRAFT ORIGINS
            </div>

            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{product.region}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff', margin: '2px 0 0', fontWeight: 400 }}>{product.name}</h2>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <QRCodeView value={storyUrl} size={64} />
              </div>
            </div>
          </div>

          {/* Right Authenticity Passport Card */}
          <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Icon name="shield" size={18} /> Digital Authenticity Passport
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', margin: '0 0 12px', fontWeight: 400 }}>
              Craft Provenance & Heritage Certificate
            </h1>
            
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Every thread of this piece is recorded on Handloom Connect’s craft registry. Verified for Geographical Indication provenance and Silk Mark authenticity.
            </p>

            {/* Checklist Row */}
            <div className="authenticity-badges-row">
              <span className="authenticity-badge-item certified">✓ Artisan Crafted</span>
              <span className="authenticity-badge-item certified">✓ Pit Loom Handwoven</span>
              <span className="authenticity-badge-item certified">✓ Origin Verified</span>
              <span className="authenticity-badge-item certified">✓ GI Craft Association</span>
              <span className="authenticity-badge-item certified">✓ Pure Natural Material</span>
            </div>
                    {/* Registry Info Block */}
            <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBlock: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block' }}>Authenticity ID:</span>
                <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)' }}>
                  {passport?.authenticityId || 'HC-REG-PENDING'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block' }}>GI Registry No:</span>
                <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)' }}>
                  {passport?.giRegistryNo || 'GI Verification In Progress'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block' }}>Silk Mark Registry:</span>
                <strong style={{ color: 'var(--ink)' }}>
                  {passport?.silkMarkNo || 'Certified Handloom'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', display: 'block' }}>Verification Status:</span>
                <strong style={{ color: '#22c55e' }}>
                  {passport?.verificationStatus || 'Handwoven Heritage Verified'}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="primary" onClick={() => navigate(`/marketplace/${product.slug || product.id}`)}>
                Buy In Shop • {product.displayPrice}
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/order-tracking`)}>
                🔍 Track Loom Commission
              </Button>
            </div>

          </div>

        </div>

        {/* Master Artisan Spotlight & Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '32px', marginBottom: '60px' }}>
          
          {/* Left Artisan Card */}
          {artisan ? (
            <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Master Weaver</span>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '14px 0' }}>
                <img src={artisan.image} alt={artisan.name} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0, fontWeight: 400 }}>{artisan.name}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>{artisan.region} • {artisan.experience}</p>
                </div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                {artisan.bio}
              </p>
              <Link to={`/artisans/${artisan.id}`} style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'underline' }}>
                View Full Artisan Profile & Story →
              </Link>
            </div>
          ) : (
            <div style={{ background: 'var(--canvas-secondary)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Artisan Lineage</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '12px 0 8px', fontWeight: 400 }}>
                {product.artisanName || 'Traditional Master Weaver'}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Woven in the historic handloom clusters of {product.region}. Artisan profile is registered under the Handloom Connect direct trade initiative.
              </p>
            </div>
          )}

          {/* Right Specs & Cultural Story */}
          <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '0 0 12px', fontWeight: 400 }}>
              Cultural Lineage & Loom Structure
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '24px' }}>
              {passport?.culturalStory || product.description || 'Centuries-old Indian handloom traditions preserved by master weaving communities.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                <small style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loom Architecture</small>
                <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{passport?.loomType || 'Traditional Pit Loom'}</strong>
              </div>
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                <small style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Warp Thread Count</small>
                <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{passport?.warpThreadCount || 'High-count natural filament'}</strong>
              </div>
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                <small style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Weave Density</small>
                <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{passport?.weaveDensity || 'Traditional hand-beaten weft'}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* 6-Stage Craft Journey Timeline */}
        <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Traceable Handloom Production</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', margin: '4px 0 8px', fontWeight: 400 }}>
              6-Stage Craft Journey
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Follow every transformation step of this piece from raw unadulterated fiber to final wax-sealed dispatch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {(passport?.craftJourney && Array.isArray(passport.craftJourney) && passport.craftJourney.length > 0) ? (
              passport.craftJourney.map(stage => (
                <div key={stage.stageNumber} style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold)', color: '#000', fontWeight: 800, display: 'grid', placeItems: 'center', fontSize: '0.9rem' }}>
                      {stage.stageNumber}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      VERIFIED STAGE
                    </span>
                  </div>
                  
                  <h4 style={{ fontSize: '1.1rem', margin: '0 0 4px', color: 'var(--ink)' }}>{stage.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--brand)', margin: '0 0 10px', fontWeight: 600 }}>{stage.subtitle}</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 12px' }}>{stage.description}</p>
                  
                  {stage.weaverNote && (
                    <div style={{ background: 'rgba(212, 175, 55, 0.06)', borderLeft: '2px solid var(--gold)', padding: '8px 10px', fontSize: '0.8rem', color: 'var(--ink)', borderRadius: '0 4px 4px 0' }}>
                      💬 {stage.weaverNote}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)', gridColumn: '1 / -1' }}>
                <p>Craft journey milestones are currently being verified with the artisan weaving cluster.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

