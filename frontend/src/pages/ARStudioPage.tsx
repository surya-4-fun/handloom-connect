import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button, ButtonLink } from '../components/primitives/Button'
import { fetchProducts, fetchProductDetail } from '../services/productService'
import { fetchProduct360 } from '../services/product360Service'
import { fetchArtisanStory, type ArtisanStoryResult } from '../services/artisanService'
import { QRCodeView } from '../components/primitives/QRCodeView'
import type { ShopProduct } from '../types/shopTypes'
import type { Product360Image } from '../types/product360'
import type { CameraPermissionState, StudioBackdrop } from '../types/arPreview'

type LightMode = 'warm' | 'daylight' | 'gala' | 'interior'

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

export function ARStudioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramProductId = searchParams.get('productId') || searchParams.get('product') || ''

  // Catalog products from backend
  const [catalogProducts, setCatalogProducts] = useState<ShopProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [catalogError, setCatalogError] = useState('')

  // 360 images
  const [frames, setFrames] = useState<Product360Image[]>([])
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)

  // Spatial transformations
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [rotationDeg, setRotationDeg] = useState(0)

  // Atmosphere & Camera
  const [lightMode, setLightMode] = useState<LightMode>('warm')
  const [cameraState, setCameraState] = useState<CameraPermissionState>('idle')
  const [cameraError, setCameraError] = useState('')
  const [selectedBackdrop, setSelectedBackdrop] = useState<StudioBackdrop>('atelier')
  const [snapshotToast, setSnapshotToast] = useState(false)

  // Story Lens state
  const paramStoryLens = searchParams.get('storyLens') === 'true'
  const [storyLensActive, setStoryLensActive] = useState(paramStoryLens)
  const [artisanStory, setArtisanStory] = useState<ArtisanStoryResult | null>(null)

  // Drag tracking
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, initialPosX: 0, initialPosY: 0 })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

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
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
      } catch {
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
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string }
      console.warn('[AR Studio] Camera access not granted:', e?.name || e?.message)
      if (e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError') {
        setCameraState('denied')
        setCameraError('Camera access was denied. Virtual drape continues in studio backdrop mode.')
      } else if (e?.name === 'NotFoundError' || e?.name === 'DevicesNotFoundError') {
        setCameraState('unsupported')
        setCameraError('No video input device detected on this system.')
      } else {
        setCameraState('unsupported')
        setCameraError('Unable to initialize video camera feed.')
      }
    }
  }, [])

  // Reset spatial transformations
  const handleReset = useCallback(() => {
    setPosX(0)
    setPosY(0)
    setScale(1.0)
    setRotationDeg(0)
    setCurrentFrameIdx(0)
  }, [])

  // Fetch genuine catalog products from backend API
  useEffect(() => {
    let isMounted = true
    setIsLoadingCatalog(true)
    setCatalogError('')

    fetchProducts()
      .then(async res => {
        if (!isMounted) return
        const prods = res?.products || []
        setCatalogProducts(prods)

        if (paramProductId) {
          // Look for product in catalog
          const found = prods.find(
            p => p.id === paramProductId || p.slug === paramProductId
          )
          if (found) {
            setSelectedProduct(found)
          } else {
            // Try fetching specific product detail by ID/slug
            try {
              const detailRes = await fetchProductDetail(paramProductId)
              if (detailRes?.product) {
                setSelectedProduct(detailRes.product)
              } else {
                setCatalogError(`Product with ID "${paramProductId}" was not found in the catalog.`)
              }
            } catch {
              setCatalogError(`Product with ID "${paramProductId}" was not found in the catalog.`)
            }
          }
        } else if (prods.length > 0) {
          setSelectedProduct(prods[0])
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('[AR Studio] Failed to fetch catalog products:', err)
          setCatalogError('Unable to connect to the product catalog right now.')
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingCatalog(false)
      })

    return () => {
      isMounted = false
      stopCameraStream()
    }
  }, [paramProductId, stopCameraStream])

  // Fetch 360 assets whenever selected product changes
  useEffect(() => {
    if (!selectedProduct) {
      setFrames([])
      return
    }

    handleReset()
    fetchProduct360(selectedProduct.id || selectedProduct.slug)
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
  }, [selectedProduct, handleReset])

  // Fetch artisan story whenever selected product changes
  useEffect(() => {
    let isMounted = true
    if (selectedProduct?.artisanId) {
      fetchArtisanStory(selectedProduct.artisanId)
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
  }, [selectedProduct?.artisanId])

  // Attach video stream if camera becomes active
  useEffect(() => {
    if (cameraState === 'active' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [cameraState])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
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
  }, [handleReset])

  // Lighting filters
  const getLightingFilter = () => {
    switch (lightMode) {
      case 'daylight':
        return 'brightness(1.08) contrast(1.05) saturate(1.1)'
      case 'gala':
        return 'sepia(0.2) brightness(0.95) contrast(1.15) hue-rotate(-10deg) saturate(1.4)'
      case 'interior':
        return 'brightness(0.92) contrast(0.98) saturate(0.9)'
      case 'warm':
      default:
        return 'brightness(1.02) contrast(1.08) sepia(0.08) saturate(1.2)'
    }
  }

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

  // Touch drag handlers
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

  const handleTakeSnapshot = () => {
    setSnapshotToast(true)
    setTimeout(() => setSnapshotToast(false), 3500)
  }

  const handleSelectProduct = (prod: ShopProduct) => {
    setSelectedProduct(prod)
    setSearchParams({ productId: prod.id })
    setCatalogError('')
  }

  const hasRotational360 = frames.length > 0
  const activeImage = selectedProduct
    ? hasRotational360
      ? frames[currentFrameIdx]?.url || selectedProduct.images[0]
      : selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images[0]
      : ''
    : ''

  const currentBackdropBg =
    BACKDROPS.find(b => b.id === selectedBackdrop)?.bg || BACKDROPS[0].bg

  return (
    <div
      className="ar-studio-page"
      style={{
        background: 'var(--canvas)',
        color: 'var(--ink)',
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '100px'
      }}
    >
      {/* Page Header */}
      <div className="container" style={{ marginBottom: '2.5rem' }}>
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>
          Interactive Atelier
        </p>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 4.8vw, 4.4rem)',
            fontFamily: 'var(--font-display)',
            margin: '0.4rem 0 0.8rem',
            lineHeight: 1.1
          }}
        >
          Virtual Drape & AR Preview Studio
        </h1>
        <p style={{ maxWidth: '680px', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Experience authentic handcrafted handloom textiles rendered in browser-based spatial view. Observe natural weave drape, lighting response, and scale in real-time.
        </p>
      </div>

      {/* Loading state */}
      {isLoadingCatalog && (
        <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
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
          <p style={{ color: 'var(--gold)', fontSize: '1.1rem', fontWeight: 600 }}>
            Loading authentic catalog pieces from handloom registry...
          </p>
        </div>
      )}

      {/* Error or Invalid Product State */}
      {!isLoadingCatalog && catalogError && !selectedProduct && (
        <div className="container">
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧵</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                margin: '0 0 12px',
                color: 'var(--ink)'
              }}
            >
              Product Not Found in Catalog
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
              {catalogError}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <ButtonLink to="/marketplace" variant="primary">
                Browse Marketplace Catalog
              </ButtonLink>
              {catalogProducts.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => handleSelectProduct(catalogProducts[0])}
                >
                  Load Featured Piece
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Viewport */}
      {!isLoadingCatalog && selectedProduct && (
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left: Spatial Viewport Frame */}
          <div
            style={{
              position: 'relative',
              background: '#0e0c0a',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
            }}
          >
            {/* Top Bar Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                zIndex: 10,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: cameraState === 'active' ? '#10b981' : 'var(--gold)',
                    boxShadow:
                      cameraState === 'active'
                        ? '0 0 12px #10b981'
                        : '0 0 12px var(--gold)'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)'
                  }}
                >
                  {cameraState === 'active'
                    ? 'Camera Viewfinder Active'
                    : 'Studio Virtual Canvas'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {/* Story Lens Toggle */}
                <button
                  type="button"
                  onClick={() => setStoryLensActive(prev => !prev)}
                  style={{
                    background: storyLensActive ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.1)',
                    border: storyLensActive ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.2)',
                    color: storyLensActive ? 'var(--gold)' : '#fff',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon name="sparkles" size={14} />
                  {storyLensActive ? 'AR Story Lens: ON' : 'AR Story Lens'}
                </button>

                {cameraState === 'active' ? (
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    style={{
                      background: 'rgba(239,68,68,0.2)',
                      color: '#fca5a5',
                      border: '1px solid #ef4444',
                      borderRadius: '100px',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🛑 Disable Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startCameraStream}
                    style={{
                      background: 'var(--gold)',
                      color: '#000',
                      border: '1px solid var(--gold)',
                      borderRadius: '100px',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Icon name="sparkles" size={14} />
                    Launch Camera Viewfinder
                  </button>
                )}
              </div>
            </div>

            {/* Viewfinder Notification Badge */}
            {cameraError && (
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: 'var(--ink)',
                  marginBottom: '12px'
                }}
              >
                ℹ️ {cameraError}
              </div>
            )}

            {/* Viewport Canvas */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'relative',
                height: '520px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: cameraState === 'active' ? '#000' : currentBackdropBg,
                display: 'grid',
                placeItems: 'center',
                cursor: isDraggingRef.current ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
              }}
            >
              {/* Local camera stream */}
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

              {/* Viewfinder Reticle Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: '16px',
                  border: '1px dashed rgba(212,175,55,0.35)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  zIndex: 5
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--gold)',
                    letterSpacing: '0.12em',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    alignSelf: 'flex-start'
                  }}
                >
                  [VIRTUAL DRAPE PREVIEW]
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--gold)',
                    letterSpacing: '0.12em',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    alignSelf: 'flex-start'
                  }}
                >
                  SCALE {Math.round(scale * 100)}%
                </span>
              </div>

              {/* Product Visual Overlay */}
              {activeImage ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotationDeg}deg)`,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out, filter 0.4s ease',
                    filter: getLightingFilter(),
                    display: 'grid',
                    placeItems: 'center',
                    zIndex: 6
                  }}
                >
                  <img
                    src={activeImage}
                    alt={selectedProduct.name}
                    style={{
                      maxHeight: '400px',
                      maxWidth: '85%',
                      objectFit: 'contain',
                      borderRadius: '16px',
                      boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ) : (
                <div style={{ zIndex: 6, textAlign: 'center', color: 'var(--muted)' }}>
                  ⚠️ No catalog image available for this piece.
                </div>
              )}

              {/* Navigation Cue */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '100px',
                  padding: '6px 16px',
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                  zIndex: 7,
                  whiteSpace: 'nowrap'
                }}
              >
                Drag to Reposition · Scale: {Math.round(scale * 100)}%
              </div>

              {/* Story Lens HUD Overlay */}
              {storyLensActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '3.6rem',
                    left: '1rem',
                    right: '1rem',
                    background: 'rgba(15, 13, 11, 0.92)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--gold)',
                    borderRadius: '12px',
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

            {/* Atmosphere & Scale Controls */}
            <div
              style={{
                marginTop: '1.2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              {/* Lighting Atmosphere Selector */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--muted)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Lighting Atmosphere
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {(['warm', 'daylight', 'gala', 'interior'] as LightMode[]).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setLightMode(mode)}
                      style={{
                        background:
                          lightMode === mode ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                        color: lightMode === mode ? '#000' : '#fff',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        padding: '8px 4px',
                        fontSize: '0.72rem',
                        fontWeight: lightMode === mode ? 600 : 400,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {cameraState !== 'active' && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--muted)',
                        marginBottom: '0.4rem'
                      }}
                    >
                      Studio Backdrop
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {BACKDROPS.map(bd => (
                        <button
                          key={bd.id}
                          type="button"
                          onClick={() => setSelectedBackdrop(bd.id)}
                          style={{
                            background:
                              selectedBackdrop === bd.id ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                            border:
                              selectedBackdrop === bd.id
                                ? '1px solid var(--gold)'
                                : '1px solid rgba(255,255,255,0.15)',
                            color: selectedBackdrop === bd.id ? 'var(--gold)' : 'var(--muted)',
                            borderRadius: '8px',
                            padding: '6px 4px',
                            fontSize: '0.7rem',
                            fontWeight: selectedBackdrop === bd.id ? 700 : 400,
                            cursor: 'pointer'
                          }}
                        >
                          {bd.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Scale Slider */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: 'var(--muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                  }}
                >
                  <span>Scale Zoom</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                    {Math.round(scale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={scale}
                  onChange={e => setScale(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                  aria-label="Adjust product zoom scale"
                />
              </div>
            </div>

            {/* Rotation & Reset Row */}
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '1rem',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {hasRotational360 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentFrameIdx(prev => (prev - 1 + frames.length) % frames.length)
                      }
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      ◀ Angle
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentFrameIdx(prev => (prev + 1) % frames.length)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Angle ▶
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--gold)',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ↺ Reset View
                </button>
              </div>

              <Button
                variant="ghost"
                onClick={handleTakeSnapshot}
                style={{ fontSize: '0.8rem', padding: '6px 16px' }}
              >
                📸 Capture Snapshot
              </Button>
            </div>
          </div>

          {/* Right: Authentic Product Details & Genuine Catalog Selector */}
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '2rem'
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                display: 'block',
                marginBottom: '0.4rem'
              }}
            >
              {selectedProduct.category} · {selectedProduct.region}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                margin: 0,
                fontWeight: 400
              }}
            >
              {selectedProduct.name}
            </h2>
            <p
              style={{
                fontSize: '1.4rem',
                color: 'var(--gold)',
                fontWeight: 600,
                margin: '0.6rem 0 1.2rem'
              }}
            >
              {selectedProduct.displayPrice}
            </p>

            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}
            >
              {selectedProduct.description}
            </p>

            {/* Authentic Artisan & Loom Specifications from DB */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '1.2rem',
                marginBottom: '1.8rem',
                display: 'grid',
                gap: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--muted)' }}>Weave Craft</span>
                <strong style={{ color: 'var(--gold)' }}>{selectedProduct.technique}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--muted)' }}>Authentic Material</span>
                <strong style={{ color: '#fff' }}>{selectedProduct.material}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--muted)' }}>Cluster Origin</span>
                <strong style={{ color: '#fff' }}>{selectedProduct.region}</strong>
              </div>
              {selectedProduct.dimensions && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Dimensions</span>
                  <strong style={{ color: '#fff' }}>{selectedProduct.dimensions}</strong>
                </div>
              )}
            </div>

            {/* Catalog Swatch Selector: Switch between genuine catalog pieces */}
            {catalogProducts.length > 1 && (
              <div style={{ marginBottom: '1.8rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--muted)',
                    marginBottom: '0.8rem'
                  }}
                >
                  Select Another Heirloom from Catalog ({catalogProducts.length} pieces)
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px'
                  }}
                >
                  {catalogProducts.slice(0, 8).map(item => {
                    const isSelected = item.id === selectedProduct.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectProduct(item)}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: isSelected
                            ? '2px solid var(--gold)'
                            : '1px solid rgba(255,255,255,0.15)',
                          padding: 0,
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.35)' : 'none',
                          background: '#000'
                        }}
                        aria-label={`Select ${item.name}`}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Link
                to={`/marketplace/${selectedProduct.slug || selectedProduct.id}`}
                className="button button--primary button--gold-glow"
                style={{ textAlign: 'center', padding: '14px 24px', justifyContent: 'center' }}
              >
                Acquire This Piece · {selectedProduct.displayPrice}
              </Link>
              <ButtonLink
                to="/marketplace"
                variant="ghost"
                style={{ width: '100%', textAlign: 'center', padding: '12px 24px' }}
              >
                ← Back to Full Marketplace
              </ButtonLink>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot Toast Feedback */}
      {snapshotToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--gold)',
            color: '#000',
            padding: '14px 24px',
            borderRadius: '100px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            zIndex: 100
          }}
        >
          ✨ High-resolution virtual drape reference captured!
        </div>
      )}
    </div>
  )
}
