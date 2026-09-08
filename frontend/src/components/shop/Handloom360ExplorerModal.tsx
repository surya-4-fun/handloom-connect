import { useState, useEffect, useRef, useCallback } from 'react'
import type { ShopProduct } from '../../types/shopTypes'
import type { Product360Data, CraftHotspot } from '../../types/product360'
import { fetchProduct360 } from '../../services/product360Service'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'

interface Handloom360ExplorerModalProps {
  product: ShopProduct | null
  isOpen: boolean
  onClose: () => void
  onOpenAIWearPreview?: () => void
}

type ActiveTab = '360-view' | 'authenticity' | 'stages' | 'artisan'

export function Handloom360ExplorerModal({
  product,
  isOpen,
  onClose,
  onOpenAIWearPreview
}: Handloom360ExplorerModalProps) {
  const [data, setData] = useState<Product360Data | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const [isAutoSpinning, setIsAutoSpinning] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('360-view')
  const [showHotspots, setShowHotspots] = useState(true)
  const [selectedHotspot, setSelectedHotspot] = useState<CraftHotspot | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  // Drag interaction tracking
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startFrameRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch 360 data on open
  useEffect(() => {
    if (isOpen && product) {
      setIsLoading(true)
      setCurrentFrameIdx(0)
      setIsAutoSpinning(false)
      setSelectedHotspot(null)
      setIsZoomed(false)
      setActiveTab('360-view')

      fetchProduct360(product.id || product.slug)
        .then(res => {
          setData(res)
          if (res?.hotspots && res.hotspots.length > 0) {
            setSelectedHotspot(res.hotspots[0])
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [isOpen, product])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Auto-spin turntable timer
  useEffect(() => {
    if (!isAutoSpinning || !data?.images.length) return
    const interval = setInterval(() => {
      setCurrentFrameIdx(prev => (prev + 1) % data.images.length)
    }, 600)
    return () => clearInterval(interval)
  }, [isAutoSpinning, data?.images.length])

  // Frame navigation helpers
  const handleNextFrame = useCallback(() => {
    if (!data?.images.length) return
    setCurrentFrameIdx(prev => (prev + 1) % data.images.length)
  }, [data?.images.length])

  const handlePrevFrame = useCallback(() => {
    if (!data?.images.length) return
    setCurrentFrameIdx(prev => (prev - 1 + data.images.length) % data.images.length)
  }, [data?.images.length])

  const handleResetAngle = useCallback(() => {
    setCurrentFrameIdx(0)
    setIsAutoSpinning(false)
  }, [])

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!data?.images.length || isZoomed) return
    isDraggingRef.current = true
    startXRef.current = e.clientX
    startFrameRef.current = currentFrameIdx
    setIsAutoSpinning(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !data?.images.length) return
    const deltaX = e.clientX - startXRef.current
    const sensitivity = 25 // pixels per frame
    const frameDelta = Math.floor(deltaX / sensitivity)
    const total = data.images.length
    const nextIdx = (startFrameRef.current - frameDelta) % total
    setCurrentFrameIdx(nextIdx >= 0 ? nextIdx : nextIdx + total)
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  // Touch Swipe handlers (Mobile & Tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!data?.images.length || isZoomed) return
    isDraggingRef.current = true
    startXRef.current = e.touches[0].clientX
    startFrameRef.current = currentFrameIdx
    setIsAutoSpinning(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !data?.images.length) return
    const deltaX = e.touches[0].clientX - startXRef.current
    const sensitivity = 22
    const frameDelta = Math.floor(deltaX / sensitivity)
    const total = data.images.length
    const nextIdx = (startFrameRef.current - frameDelta) % total
    setCurrentFrameIdx(nextIdx >= 0 ? nextIdx : nextIdx + total)
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  if (!isOpen || !product) return null

  const images = data?.images || []
  const hasImages = images.length > 0
  const currentImg = hasImages ? images[currentFrameIdx] : null
  const currentAngleDeg = hasImages ? Math.round((currentFrameIdx / images.length) * 360) : 0

  return (
    <div
      className="support-modal-backdrop"
      style={{ zIndex: 1006 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="handloom-360-title"
    >
      <div
        className="support-modal-card"
        style={{
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--gold)',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.2)',
          position: 'relative',
          padding: '24px'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'var(--ink)',
            fontSize: '1.4rem',
            cursor: 'pointer',
            padding: '4px 8px',
            zIndex: 10
          }}
          aria-label="Close 360 Explorer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Icon name="sparkles" size={14} /> 360° Handloom Explorer
          </span>
          <h2
            id="handloom-360-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
              margin: '4px 0',
              fontWeight: 400,
              color: 'var(--ink)'
            }}
          >
            {product.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
            {product.technique} • {product.region} • <span style={{ color: 'var(--gold)' }}>{product.displayPrice}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
            marginBottom: '20px',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('360-view')}
            style={{
              background: activeTab === '360-view' ? 'rgba(212,175,55,0.18)' : 'transparent',
              border: activeTab === '360-view' ? '1px solid var(--gold)' : '1px solid transparent',
              color: activeTab === '360-view' ? 'var(--gold)' : 'var(--muted)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🔄 360° Rotation View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('authenticity')}
            style={{
              background: activeTab === 'authenticity' ? 'rgba(212,175,55,0.18)' : 'transparent',
              border: activeTab === 'authenticity' ? '1px solid var(--gold)' : '1px solid transparent',
              color: activeTab === 'authenticity' ? 'var(--gold)' : 'var(--muted)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🛡️ GI & Silk Mark Authenticity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stages')}
            style={{
              background: activeTab === 'stages' ? 'rgba(212,175,55,0.18)' : 'transparent',
              border: activeTab === 'stages' ? '1px solid var(--gold)' : '1px solid transparent',
              color: activeTab === 'stages' ? 'var(--gold)' : 'var(--muted)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🧵 Behind the Loom Stages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('artisan')}
            style={{
              background: activeTab === 'artisan' ? 'rgba(212,175,55,0.18)' : 'transparent',
              border: activeTab === 'artisan' ? '1px solid var(--gold)' : '1px solid transparent',
              color: activeTab === 'artisan' ? 'var(--gold)' : 'var(--muted)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            👤 Master Artisan
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                border: '3px solid rgba(212,175,55,0.2)',
                borderTopColor: 'var(--gold)',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Loading multi-angle photographic sequence & craft metadata...
            </p>
          </div>
        )}

        {/* MISSING 360 ASSETS STATE */}
        {!isLoading && !hasImages && activeTab === '360-view' && (
          <div
            style={{
              background: 'var(--canvas)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '40px 24px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📷</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', margin: '0 0 8px' }}>
              360° Preview in Documentation
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              360° photographic preview is currently being documented for this heirloom. You can view the high-resolution gallery and AI Wear Preview.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {onOpenAIWearPreview && (
                <Button
                  variant="primary"
                  onClick={() => {
                    onClose()
                    onOpenAIWearPreview()
                  }}
                >
                  <Icon name="sparkles" size={16} /> Open AI Wear Preview
                </Button>
              )}
              <Button variant="secondary" onClick={onClose}>
                Back to Product Gallery
              </Button>
            </div>
          </div>
        )}

        {/* TAB 1: 360 ROTATION VIEW */}
        {!isLoading && hasImages && activeTab === '360-view' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Interactive Canvas */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'relative',
                background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, rgba(15,13,11,0.95) 100%)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: isDraggingRef.current ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
                height: '380px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Image Frame */}
              <img
                src={currentImg?.url || product.images[0]}
                alt={`${product.name} at ${currentImg?.angleLabel || `${currentAngleDeg}°`}`}
                style={{
                  maxHeight: isZoomed ? '500px' : '340px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  transform: isZoomed ? 'scale(1.35)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  pointerEvents: 'none'
                }}
              />

              {/* Angle & Frame Overlay Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(15,13,11,0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(212,175,55,0.4)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  color: 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                <strong>{currentImg?.angleLabel || `${currentAngleDeg}° View`}</strong>
                <span style={{ color: 'var(--muted)' }}>
                  ({currentFrameIdx + 1}/{images.length})
                </span>
              </div>

              {/* Hotspots Toggle Badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowHotspots(v => !v)
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: showHotspots ? 'rgba(212,175,55,0.25)' : 'rgba(15,13,11,0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--gold)',
                  color: showHotspots ? 'var(--gold)' : 'var(--muted)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {showHotspots ? '● Craft Hotspots: ON' : '○ Craft Hotspots: OFF'}
              </button>

              {/* Interactive Craft Hotspots */}
              {showHotspots && data?.hotspots && data.hotspots.map(spot => {
                const isSelected = selectedHotspot?.id === spot.id
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedHotspot(spot)
                    }}
                    style={{
                      position: 'absolute',
                      top: `${spot.yPercent}%`,
                      left: `${spot.xPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--gold)' : 'rgba(212,175,55,0.75)',
                      border: '2px solid #fff',
                      boxShadow: '0 0 16px rgba(212,175,55,0.8)',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#0A0908',
                      fontSize: '12px',
                      fontWeight: 800,
                      zIndex: 5,
                      animation: isSelected ? 'pulse 1.5s infinite' : 'none'
                    }}
                    aria-label={`View detail: ${spot.title}`}
                  >
                    +
                  </button>
                )
              })}

              {/* Drag Indicator Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(15,13,11,0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 14px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>←</span> Drag or Swipe to Rotate <span>→</span>
              </div>
            </div>

            {/* Rotation Controls Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: 'var(--canvas)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                flexWrap: 'wrap'
              }}
            >
              {/* Frame Steppers */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handlePrevFrame}
                  className="button button--secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  aria-label="Previous angle"
                >
                  ◀ Prev Angle
                </button>
                <button
                  type="button"
                  onClick={handleNextFrame}
                  className="button button--secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  aria-label="Next angle"
                >
                  Next Angle ▶
                </button>
              </div>

              {/* Auto Spin Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoSpinning(v => !v)}
                className={`button ${isAutoSpinning ? 'button--primary' : 'button--secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                {isAutoSpinning ? '⏸ Pause Turntable' : '▶ Auto Rotate'}
              </button>

              {/* Zoom & Reset */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsZoomed(v => !v)}
                  className="button button--ghost"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--border)' }}
                >
                  {isZoomed ? '🔍 Reset Zoom' : '🔍 Inspect Texture'}
                </button>
                <button
                  type="button"
                  onClick={handleResetAngle}
                  className="button button--ghost"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--border)' }}
                >
                  ↺ Reset Front
                </button>
              </div>
            </div>

            {/* Angle Scrubber Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '4px' }}>
                <span>0° (Front)</span>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{currentAngleDeg}° ({currentImg?.angleLabel})</span>
                <span>360°</span>
              </div>
              <input
                type="range"
                min={0}
                max={images.length - 1}
                step={1}
                value={currentFrameIdx}
                onChange={e => {
                  setCurrentFrameIdx(Number(e.target.value))
                  setIsAutoSpinning(false)
                }}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                aria-label="Rotate product angle"
              />
            </div>

            {/* Selected Craft Hotspot Detail Card */}
            {selectedHotspot && showHotspots && (
              <div
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 800 }}>
                    Craft Facet: {selectedHotspot.craftFacet}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)', margin: '2px 0 4px' }}>
                    {selectedHotspot.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                    {selectedHotspot.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHotspot(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AUTHENTICITY & GI DETAILS */}
        {!isLoading && activeTab === 'authenticity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)' }}>
                  Heirloom Provenance Certificate
                </span>
                <span style={{ fontSize: '0.75rem', color: data?.passport ? '#22c55e' : 'var(--muted)', fontWeight: 700 }}>
                  {data?.passport ? `✓ ${data.passport.verificationStatus}` : 'Verification Pending'}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', margin: '0 0 10px' }}>
                Authenticity Credentials & Loom Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '14px' }}>
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <small style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>GI Registry No.</small>
                  <strong style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>{data?.passport?.giRegistryNo || 'Not Registered / Pending'}</strong>
                </div>
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <small style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Silk Mark Certificate</small>
                  <strong style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>{data?.passport?.silkMarkNo || 'Not Certified'}</strong>
                </div>
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <small style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Loom Architecture</small>
                  <strong style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>{data?.passport?.loomType || 'Traditional Handloom'}</strong>
                </div>
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <small style={{ display: 'block', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Weft / Warp Density</small>
                  <strong style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>{data?.passport?.weaveDensity || 'Handwoven Standard Density'}</strong>
                </div>
              </div>
            </div>

            {data?.passport?.culturalStory && (
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0 0 8px' }}>
                  Cultural History & Tradition
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                  {data.passport.culturalStory}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BEHIND THE LOOM STAGES */}
        {!isLoading && activeTab === 'stages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {data?.passport?.craftJourney && data.passport.craftJourney.length > 0 ? (
              data.passport.craftJourney.map(stg => (
                <div key={stg.stageNumber} style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '0.88rem' }}>
                      Stage {stg.stageNumber}: {stg.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>✓ Verified Stage</span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '0.84rem', color: 'var(--muted)' }}>{stg.description}</p>
                  {stg.weaverNote && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink)', fontStyle: 'italic' }}>
                      💬 Weaver Note: &quot;{stg.weaverNote}&quot;
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem', background: 'var(--canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                Authoritative craft journey stages are not currently registered for this piece.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MASTER ARTISAN */}
        {!isLoading && activeTab === 'artisan' && (
          <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              {data?.artisan?.image && (
                <img
                  src={data.artisan.image}
                  alt={data.artisan.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }}
                />
              )}
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 700 }}>
                  Master Artisan Provenance
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', margin: '2px 0' }}>
                  {data?.artisan?.name || 'Heritage Guild Master'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                  {data?.artisan?.title || product.technique} • {data?.artisan?.region || product.region}
                </p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              Crafted in collaboration with certified handloom clusters. 100% of fair artisan wages are distributed directly without intermediary brokers.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {onOpenAIWearPreview && (
            <Button
              variant="gold"
              onClick={() => {
                onClose()
                onOpenAIWearPreview()
              }}
              style={{ flex: 1 }}
            >
              <Icon name="sparkles" size={16} /> Open AI Wear Preview
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Close 360° Explorer
          </Button>
        </div>
      </div>
    </div>
  )
}
