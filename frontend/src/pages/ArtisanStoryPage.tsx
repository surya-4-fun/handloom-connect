import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { QRCodeView } from '../components/primitives/QRCodeView'
import { fetchArtisanStory, type ArtisanStoryResult } from '../services/artisanService'

export function ArtisanStoryPage() {
  const { artisanId } = useParams<{ artisanId: string }>()
  const navigate = useNavigate()

  const [storyData, setStoryData] = useState<ArtisanStoryResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    let isMounted = true
    if (!artisanId) {
      setIsLoading(false)
      setError('Invalid artisan identifier.')
      return
    }

    setIsLoading(true)
    setError(null)

    fetchArtisanStory(artisanId)
      .then(data => {
        if (!isMounted) return
        if (data && data.artisan) {
          setStoryData(data)
        } else {
          setError('Artisan story unavailable or not found in the verified craft registry.')
        }
      })
      .catch(err => {
        if (!isMounted) return
        console.error('[ArtisanStoryPage] Error fetching artisan story:', err)
        setError('Failed to connect to the artisan story registry. Please try again later.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [artisanId])

  const storyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/artisan-story/${artisanId}`
    : `/artisan-story/${artisanId}`

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(storyUrl)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2500)
      }
    } catch {
      // Fallback or ignore
    }
  }

  if (isLoading) {
    return (
      <div
        className="artisan-story-page section-pad"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--canvas)',
          color: 'var(--ink)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(212, 175, 55, 0.2)',
              borderTopColor: 'var(--gold)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}
          />
          <p style={{ color: 'var(--gold)', fontSize: '1.05rem', fontWeight: 600 }}>
            Loading verified artisan story...
          </p>
          <small style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            Fetching authoritative records from National Handloom Registry
          </small>
        </div>
      </div>
    )
  }

  if (error || !storyData || !storyData.artisan) {
    return (
      <div
        className="artisan-story-page section-pad"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--canvas)',
          color: 'var(--ink)',
          textAlign: 'center',
          padding: '40px 20px'
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            background: 'var(--canvas-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📜</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              marginBottom: '12px',
              fontWeight: 400
            }}
          >
            Artisan Story Unavailable
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
            {error || "We couldn't locate a verified artisan story for this identifier in the Handloom Connect registry."}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => navigate('/artisans')}>
              Browse Verified Artisans
            </Button>
            <Button variant="secondary" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { artisan, products, verifiedAt } = storyData
  const displayStory = artisan.story || artisan.bio || 'Verified master weaver documented in the Handloom Connect craft registry.'
  const firstProductId = products && products.length > 0 ? products[0].id : null

  return (
    <div
      className="artisan-story-page"
      style={{
        background: 'var(--canvas)',
        color: 'var(--ink)',
        minHeight: '100vh',
        paddingBottom: '80px'
      }}
    >
      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--muted)',
            marginBottom: '1.8rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/artisans" style={{ color: 'var(--muted)' }}>Artisans</Link>
          <span>/</span>
          <Link to={`/artisans/${artisan.id}`} style={{ color: 'var(--muted)' }}>{artisan.name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Artisan Story Lens</span>
        </nav>

        {/* Hero Card: Mobile Friendly & Rich Aesthetics */}
        <div
          style={{
            background: 'var(--canvas-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(20px, 4vw, 36px)',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
          }}
        >
          {/* Subtle gold gradient accent at the top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--gold), transparent, var(--gold))'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
              alignItems: 'center'
            }}
          >
            {/* Left: Artisan Portrait & Verified Tag */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid var(--gold)',
                  boxShadow: '0 12px 32px rgba(212, 175, 55, 0.25)',
                  marginBottom: '16px'
                }}
              >
                {artisan.image ? (
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'var(--surface)',
                      fontSize: '3rem',
                      color: 'var(--gold)'
                    }}
                  >
                    🧵
                  </div>
                )}
              </div>

              <span
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid var(--gold)',
                  color: 'var(--gold)',
                  padding: '4px 14px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ✓ Certified Artisan Story
              </span>

              {verifiedAt && (
                <small style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '6px' }}>
                  Verified: {new Date(verifiedAt).toLocaleDateString()}
                </small>
              )}
            </div>

            {/* Right: Master Information & Badges */}
            <div>
              <p
                style={{
                  color: 'var(--gold)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '6px'
                }}
              >
                {artisan.region ? `Heritage Cluster: ${artisan.region}` : 'Traditional Handloom Artisan'}
              </p>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                  margin: '0 0 10px',
                  fontWeight: 400,
                  color: 'var(--ink)'
                }}
              >
                {artisan.name}
              </h1>

              <p style={{ fontSize: '1.05rem', color: 'var(--brand)', fontWeight: 600, marginBottom: '14px' }}>
                {artisan.title || artisan.craft}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {artisan.craft && (
                  <div
                    style={{
                      background: 'var(--canvas)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 14px'
                    }}
                  >
                    <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Craft Specialization</small>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{artisan.specialty || artisan.craft}</strong>
                  </div>
                )}
                {artisan.experience && (
                  <div
                    style={{
                      background: 'var(--canvas)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 14px'
                    }}
                  >
                    <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Documented Experience</small>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{artisan.experience}</strong>
                  </div>
                )}
              </div>

              {/* Quick Actions Row */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {firstProductId && (
                  <Link
                    to={`/ar-studio?productId=${firstProductId}&storyLens=true`}
                    className="button button--primary button--gold-glow"
                    style={{
                      fontSize: '0.82rem',
                      padding: '8px 16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Icon name="sparkles" size={16} />
                    Launch AR Story Lens
                  </Link>
                )}
                <Link
                  to={`/artisans/${artisan.id}`}
                  className="button button--secondary"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  Full Artisan Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Story and QR Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '36px'
          }}
        >
          {/* Column 1: Verified Craft Story */}
          <div
            style={{
              background: 'var(--canvas-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(20px, 3.5vw, 32px)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', marginBottom: '12px' }}>
              <Icon name="shield" size={18} />
              <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Authoritative Craft Story
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                margin: '0 0 16px',
                fontWeight: 400
              }}
            >
              The Artisan's Journey & Heritage
            </h2>

            <p
              style={{
                color: 'var(--ink)',
                fontSize: '0.98rem',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                marginBottom: '24px',
                opacity: 0.9
              }}
            >
              {displayStory}
            </p>

            {/* Techniques */}
            {artisan.techniques && artisan.techniques.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    color: 'var(--gold)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '10px'
                  }}
                >
                  Verified Handloom Techniques
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {artisan.techniques.map(tech => (
                    <span
                      key={tech}
                      style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: 'var(--gold)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}
                    >
                      ✨ {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural Background if present */}
            {artisan.culturalBackground && (
              <div
                style={{
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginTop: '16px'
                }}
              >
                <small style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Traditional Origin & GI Provenance
                </small>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  {artisan.culturalBackground}
                </p>
              </div>
            )}

            <div
              style={{
                marginTop: '24px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                fontSize: '0.75rem',
                color: 'var(--muted)'
              }}
            >
              🔒 <strong>Strict Provenance Guarantee:</strong> All details shown above represent verified application records stored in the authoritative MySQL database. No unverified historical claims, fabricated awards, or external inferences are displayed.
            </div>
          </div>

          {/* Column 2: Scannable QR Code & Mobile Story Lens */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Scannable QR Card */}
            <div
              style={{
                background: 'var(--canvas-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(20px, 3.5vw, 32px)',
                textAlign: 'center',
                boxShadow: '0 16px 36px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--gold)', marginBottom: '8px' }}>
                <Icon name="sparkles" size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Mobile QR Story Lens
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  margin: '0 0 8px',
                  fontWeight: 400
                }}
              >
                Scan on Smartphone
              </h3>

              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 20px', lineHeight: 1.5 }}>
                Scan this authenticated QR code using any smartphone camera to open this artisan story on your mobile screen.
              </p>

              {/* QR Code Container */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  padding: '14px',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  marginBottom: '16px'
                }}
              >
                <QRCodeView value={storyUrl} size={180} />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', wordBreak: 'break-all', marginBottom: '16px' }}>
                <code>{storyUrl}</code>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="button button--secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  {copiedLink ? '✓ Copied Link' : '📋 Copy Story URL'}
                </button>
              </div>
            </div>

            {/* Community Impact if present */}
            {artisan.communityImpact && (
              <div
                style={{
                  background: 'var(--canvas-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px'
                }}
              >
                <h4 style={{ color: 'var(--gold)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px' }}>
                  🌱 Community & Loom Impact
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                  <div style={{ background: 'var(--canvas)', padding: '12px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>{artisan.communityImpact.activeLooms}</div>
                    <small style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Active Looms</small>
                  </div>
                  <div style={{ background: 'var(--canvas)', padding: '12px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{artisan.communityImpact.fairWagePercentage}%</div>
                    <small style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Fair Wage</small>
                  </div>
                  <div style={{ background: 'var(--canvas)', padding: '12px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>{artisan.communityImpact.apprenticesTrained}</div>
                    <small style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Apprentices</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Associated Handloom Products from MySQL */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Artisan Catalog
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '4px 0 0', fontWeight: 400 }}>
                Handwoven Creations by {artisan.name}
              </h2>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {products.length} {products.length === 1 ? 'piece' : 'pieces'} recorded in registry
            </span>
          </div>

          {products.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '20px'
              }}
            >
              {products.map(p => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--canvas-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--surface)' }}>
                    {p.images && p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
                        Handloom Craft
                      </div>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(6px)',
                        color: 'var(--gold)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}
                    >
                      {p.category}
                    </span>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <small style={{ color: 'var(--gold)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {p.technique} · {p.region}
                      </small>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', margin: '4px 0 8px', fontWeight: 400 }}>
                        {p.name}
                      </h4>
                      <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1rem', margin: '0 0 14px' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Link
                        to={`/marketplace/${p.id}`}
                        className="button button--secondary"
                        style={{ fontSize: '0.75rem', padding: '6px 12px', flex: 1, textAlign: 'center' }}
                      >
                        View Piece
                      </Link>
                      <Link
                        to={`/ar-studio?productId=${p.id}&storyLens=true`}
                        className="button button--primary"
                        style={{ fontSize: '0.75rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="View with AR Story Lens"
                      >
                        <Icon name="sparkles" size={12} /> AR Drape
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '32px',
                textAlign: 'center',
                background: 'var(--canvas-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border)',
                color: 'var(--muted)'
              }}
            >
              No active catalog products currently linked to this artisan.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
