import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { ShopProduct } from '../../types/shopTypes'
import type { CameraPermissionState, StudioBackdrop } from '../../types/arPreview'
import type { Product360Image } from '../../types/product360'
import { fetchProduct360 } from '../../services/product360Service'
import { fetchArtisanStory, type ArtisanStoryResult } from '../../services/artisanService'
import { QRCodeView } from '../primitives/QRCodeView'
import { Icon } from '../primitives/Icon'

interface ARProductPreviewModalProps {
  product: ShopProduct | null
  isOpen: boolean
  onClose: () => void
}

const BACKDROPS: Array<{ id: StudioBackdrop; label: string; bg: string }> = [
  {
    id: 'atelier',
    label: 'Warm Atelier',
    bg: 'radial-gradient(circle at 50% 40%, #262018 0%, #0d0b09 100%)'
  },
  {
    id: 'interior',
    label: 'Living Room',
    bg: 'radial-gradient(circle at 50% 50%, #22272a 0%, #0a0e10 100%)'
  },
  {
    id: 'daylight',
    label: 'Daylight Gallery',
    bg: 'radial-gradient(circle at 50% 40%, #2e2b26 0%, #131210 100%)'
  },
  {
    id: 'gallery',
    label: 'Museum Spotlight',
    bg: 'radial-gradient(circle at 50% 40%, #1a1612 0%, #050505 100%)'
  }
]

export function ARProductPreviewModal({
  product,
  isOpen,
  onClose
}: ARProductPreviewModalProps) {
  // Transformation state
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [rotationDeg, setRotationDeg] = useState(0)

  // Camera & backdrop state
  const [cameraState, setCameraState] = useState<CameraPermissionState>('idle')
  const [cameraError, setCameraError] = useState<string>('')
  const [selectedBackdrop, setSelectedBackdrop] = useState<StudioBackdrop>('atelier')

  // 360 Assets state
  const [frames, setFrames] = useState<Product360Image[]>([])
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)

  // Story Lens state
  const [storyLensActive, setStoryLensActive] = useState(false)
  const [artisanStory, setArtisanStory] = useState<ArtisanStoryResult | null>(null)

  useEffect(() => {
    let isMounted = true
    if (isOpen && product?.artisanId) {
      fetchArtisanStory(product.artisanId)
        .then(res => {
          if (isMounted && res) setArtisanStory(res)
        })
        .catch(() => {})
    } else {
      setArtisanStory(null)
    }
    return () => {
      isMounted = false
    }
  }, [isOpen, product?.artisanId])

  // Viewport Drag Tracking
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, initialPosX: 0, initialPosY: 0 })

  // Media stream reference
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop()
        } catch {
          // ignore
        }
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraState('off')
  }, [])

  // Start camera stream safely
  const startCameraStream = useCallback(async () => {
    setCameraError('')
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      setCameraError('Camera access is not supported in this browser environment.')
      return
    }

    setCameraState('prompting')

    try {
      let stream: MediaStream
      try {
        // Try rear/environment camera first (mobile friendly)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
      } catch {
        // Fallback to any available video device
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })
      }

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setCameraState('active')
    } catch (err: any) {
      console.warn('[AR Preview] Camera access not granted:', err?.name || err?.message)
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setCameraState('denied')
        setCameraError('Camera permission was denied. You can continue with studio backdrops.')
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setCameraState('unsupported')
        setCameraError('No video input device detected on this system.')
      } else {
        setCameraState('unsupported')
        setCameraError('Unable to initialize camera video stream.')
      }
    }
  }, [])

  // Reset transformations
  const handleReset = useCallback(() => {
    setPosX(0)
    setPosY(0)
    setScale(1.0)
    setRotationDeg(0)
    setCurrentFrameIdx(0)
  }, [])

  // Load product 360 assets and reset states on open
  useEffect(() => {
    if (isOpen && product) {
      handleReset()
      setCameraState('idle')
      setCameraError('')
      setIsLoadingAssets(true)

      fetchProduct360(product.id || product.slug)
        .then(res => {
          if (res?.has360 && Array.isArray(res.images) && res.images.length > 0) {
            setFrames(res.images)
          } else {
            setFrames([])
          }
        })
        .catch(() => {
          setFrames([])
        })
        .finally(() => {
          setIsLoadingAssets(false)
        })
    } else if (!isOpen) {
      stopCameraStream()
    }
  }, [isOpen, product, handleReset, stopCameraStream])

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCameraStream()
    }
  }, [stopCameraStream])

  // Attach video stream if camera becomes active
  useEffect(() => {
    if (cameraState === 'active' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [cameraState])

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        setPosX(prev => prev - 12)
      } else if (e.key === 'ArrowRight') {
        setPosX(prev => prev + 12)
      } else if (e.key === 'ArrowUp') {
        setPosY(prev => prev - 12)
      } else if (e.key === 'ArrowDown') {
        setPosY(prev => prev + 12)
      } else if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(2.0, +(prev + 0.1).toFixed(2)))
      } else if (e.key === '-' || e.key === '_') {
        setScale(prev => Math.max(0.5, +(prev - 0.1).toFixed(2)))
      } else if (e.key.toLowerCase() === 'r') {
        handleReset()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handleReset])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPosX: posX,
      initialPosY: posY
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPosX(dragStartRef.current.initialPosX + dx)
    setPosY(dragStartRef.current.initialPosY + dy)
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  // Touch drag handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialPosX: posX,
        initialPosY: posY
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragStartRef.current.x
    const dy = e.touches[0].clientY - dragStartRef.current.y
    setPosX(dragStartRef.current.initialPosX + dx)
    setPosY(dragStartRef.current.initialPosY + dy)
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  if (!isOpen || !product) return null

  // Authentic product images (authoritative backend source)
  const hasRotational360 = frames.length > 0
  const activeImage = hasRotational360
    ? frames[currentFrameIdx]?.url || product.images[0]
    : product.images && product.images.length > 0
    ? product.images[0]
    : ''

  const currentBackdropBg =
    BACKDROPS.find(b => b.id === selectedBackdrop)?.bg || BACKDROPS[0].bg

  return (
    <div
      className="support-modal-backdrop"
      style={{ zIndex: 1008 }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ar-preview-title"
    >
      <div
        className="support-modal-card"
        style={{
          maxWidth: '960px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          border: '1px solid var(--gold)',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 75px rgba(0,0,0,0.92), 0 0 45px rgba(212,175,55,0.22)',
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
          aria-label="Close AR Virtual Preview"
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
            <Icon name="sparkles" size={14} /> Virtual Drape & Spatial Preview
          </span>
          <h2
            id="ar-preview-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.4vw, 2.2rem)',
              margin: '4px 0',
              fontWeight: 400,
              color: 'var(--ink)'
            }}
          >
            {product.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
            {product.technique} • {product.region} •{' '}
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
              {product.displayPrice}
            </span>
          </p>
        </div>

        {/* Informational State Alerts */}
        {cameraError && (
          <div
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '0.8rem',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            <span>ℹ️</span>
            <span>{cameraError}</span>
          </div>
        )}

        {/* Main Viewport Container */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            height: '460px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            background: cameraState === 'active' ? '#000' : currentBackdropBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDraggingRef.current ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)'
          }}
        >
          {/* Live Camera Feed (Strictly Local) */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: cameraState === 'active' ? 'block' : 'none',
              pointerEvents: 'none'
            }}
          />

          {/* Fallback Ambient Grid if camera is not active */}
          {cameraState !== 'active' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(rgba(212,175,55,0.08) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                pointerEvents: 'none',
                opacity: 0.7
              }}
            />
          )}

          {/* AR Reticle / Viewfinder Frame Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: '16px',
              border: '1px dashed rgba(212,175,55,0.3)',
              borderRadius: '12px',
              pointerEvents: 'none',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  background: 'rgba(15,13,11,0.7)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                {cameraState === 'active'
                  ? '📷 Camera Viewfinder Active'
                  : `🎨 Studio Canvas: ${selectedBackdrop.toUpperCase()}`}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)',
                  background: 'rgba(15,13,11,0.7)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                Scale: {Math.round(scale * 100)}%
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.08em',
                  color: 'var(--muted)',
                  background: 'rgba(15,13,11,0.7)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                Drag / Swipe to Reposition
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--gold)',
                  background: 'rgba(15,13,11,0.7)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                {hasRotational360 ? `Angle: ${currentFrameIdx * 45}°` : 'Front Drape View'}
              </span>
            </div>
          </div>

          {/* Product Drape Visual Element */}
          {activeImage ? (
            <div
              style={{
                transform: `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotationDeg}deg)`,
                transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
                zIndex: 4,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.65))'
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  maxHeight: '340px',
                  maxWidth: '75vw',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  pointerEvents: 'none'
                }}
              />
            </div>
          ) : (
            <div
              style={{
                zIndex: 4,
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(15,13,11,0.85)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}
            >
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                ⚠️ No catalog image available for this piece.
              </p>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoadingAssets && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15,13,11,0.85)',
                border: '1px solid var(--gold)',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                color: 'var(--gold)',
                zIndex: 10
              }}
            >
              Loading authentic craft assets...
            </div>
          )}

          {/* Story Lens HUD Overlay */}
          {storyLensActive && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: 'rgba(15, 13, 11, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--gold)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                zIndex: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>
                    📜 AR Story Lens • Spatial Story Overlay
                  </span>
                </div>
                {artisanStory?.artisan ? (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {artisanStory.artisan.name} · <span style={{ color: 'var(--brand)', fontWeight: 500, fontSize: '0.78rem' }}>{artisanStory.artisan.craft} ({artisanStory.artisan.region})</span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {artisanStory.artisan.story || artisanStory.artisan.bio}
                    </p>
                  </>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    Artisan story unavailable for this piece.
                  </div>
                )}
              </div>

              {artisanStory?.artisan && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{ background: '#fff', padding: '3px', borderRadius: '6px' }}>
                    <QRCodeView value={`${window.location.origin}/artisan-story/${artisanStory.artisan.id}`} size={38} />
                  </div>
                  <Link
                    to={`/artisan-story/${artisanStory.artisan.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button button--primary"
                    style={{ fontSize: '0.72rem', padding: '5px 8px', whiteSpace: 'nowrap' }}
                  >
                    Story →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Viewport Control Bar */}
        <div
          style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            background: 'var(--canvas)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}
        >
          {/* Section 1: Camera & Backdrop Modes */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--gold)',
                marginBottom: '8px'
              }}
            >
              Environment & Story Lens
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {cameraState === 'active' ? (
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="button button--secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  🛑 Disable Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCameraStream}
                  className="button button--primary button--gold-glow"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  📷 Use Camera Viewfinder
                </button>
              )}

              {/* Story Lens Toggle */}
              <button
                type="button"
                onClick={() => setStoryLensActive(prev => !prev)}
                style={{
                  background: storyLensActive ? 'rgba(212,175,55,0.25)' : 'var(--surface)',
                  border: storyLensActive ? '1px solid var(--gold)' : '1px solid var(--border)',
                  color: storyLensActive ? 'var(--gold)' : 'var(--muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Icon name="sparkles" size={12} />
                {storyLensActive ? 'AR Story Lens: ON' : 'Enable Story Lens'}
              </button>

              {/* Backdrop selector buttons */}
              {cameraState !== 'active' &&
                BACKDROPS.map(bd => (
                  <button
                    key={bd.id}
                    type="button"
                    onClick={() => setSelectedBackdrop(bd.id)}
                    style={{
                      background:
                        selectedBackdrop === bd.id ? 'rgba(212,175,55,0.2)' : 'var(--surface)',
                      border:
                        selectedBackdrop === bd.id
                          ? '1px solid var(--gold)'
                          : '1px solid var(--border)',
                      color: selectedBackdrop === bd.id ? 'var(--gold)' : 'var(--muted)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: selectedBackdrop === bd.id ? 700 : 400
                    }}
                  >
                    {bd.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Section 2: Scale & Zoom Controls */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: 'var(--muted)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              <span>Product Scale</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                {Math.round(scale * 100)}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)))}
                className="button button--secondary"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                aria-label="Decrease scale"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={scale}
                onChange={e => setScale(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--gold)', cursor: 'pointer' }}
                aria-label="Adjust product scale"
              />
              <button
                type="button"
                onClick={() => setScale(s => Math.min(2.0, +(s + 0.1).toFixed(2)))}
                className="button button--secondary"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                aria-label="Increase scale"
              >
                +
              </button>
            </div>
          </div>

          {/* Section 3: Rotation & Reset Controls */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* 360-degree turntable stepping if assets exist */}
              {hasRotational360 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentFrameIdx(prev => (prev - 1 + frames.length) % frames.length)
                    }
                    className="button button--secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    ◀ Rotate Angle
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentFrameIdx(prev => (prev + 1) % frames.length)}
                    className="button button--secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    Rotate Angle ▶
                  </button>
                </>
              )}

              {/* Manual rotation nudges */}
              <button
                type="button"
                onClick={() => setRotationDeg(r => (r - 15) % 360)}
                className="button button--ghost"
                style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--border)' }}
                aria-label="Rotate left 15 degrees"
              >
                ↺ -15°
              </button>
              <button
                type="button"
                onClick={() => setRotationDeg(r => (r + 15) % 360)}
                className="button button--ghost"
                style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'var(--border)' }}
                aria-label="Rotate right 15 degrees"
              >
                ↻ +15°
              </button>
            </div>

            {/* Reset transformation button */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleReset}
                className="button button--secondary"
                style={{ padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600 }}
                aria-label="Reset position, scale, and rotation"
              >
                ↺ Reset View
              </button>
              <Link
                to={`/ar-studio?productId=${product.id || product.slug}`}
                className="button button--ghost"
                style={{ padding: '6px 16px', fontSize: '0.8rem', borderColor: 'var(--gold)', color: 'var(--gold)' }}
                onClick={onClose}
              >
                Open Full Studio ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Verified Product Facts Footer */}
        <div
          style={{
            marginTop: '16px',
            background: 'var(--canvas)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            fontSize: '0.8rem'
          }}
        >
          <div>
            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>
              Material
            </span>
            <strong style={{ color: 'var(--ink)' }}>{product.material}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>
              Craft / Technique
            </span>
            <strong style={{ color: 'var(--gold)' }}>{product.technique}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>
              Regional Provenance
            </span>
            <strong style={{ color: 'var(--ink)' }}>{product.region}</strong>
          </div>
          {product.dimensions && (
            <div>
              <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                Dimensions
              </span>
              <strong style={{ color: 'var(--ink)' }}>{product.dimensions}</strong>
            </div>
          )}
        </div>

        {/* Privacy & Safe Overlay Notice */}
        <p
          style={{
            margin: '12px 0 0',
            fontSize: '0.72rem',
            color: 'var(--muted)',
            textAlign: 'center',
            lineHeight: 1.4
          }}
        >
          🛡️ Privacy Guarantee: Camera feed runs locally in your browser. Video frames are never recorded, captured, or transmitted.
        </p>
      </div>
    </div>
  )
}
