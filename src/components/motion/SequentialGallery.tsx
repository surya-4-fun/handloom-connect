import React, { useState, useRef, useEffect, useCallback } from 'react'
import { defaultGalleryItems, GalleryItem } from '../../data/galleryData'
import '../../styles/gallery.css'

export interface SequentialGalleryProps {
  items?: GalleryItem[]
  autoPlayInterval?: number
  className?: string
}

// Fallback high-contrast SVG placeholder if network fails
const FALLBACK_IMAGE_DATA_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="100%" height="100%" fill="%231b1815"/><circle cx="600" cy="400" r="300" fill="none" stroke="%23d4af37" stroke-width="2" opacity="0.3"/><text x="50%" y="46%" font-family="serif" font-size="32" fill="%23d4af37" text-anchor="middle">Handloom Craft Gallery</text><text x="50%" y="54%" font-family="sans-serif" font-size="18" fill="%23a89f91" text-anchor="middle">Textile Texture Asset</text></svg>`

export function SequentialGallery({
  items = defaultGalleryItems,
  autoPlayInterval = 6000,
  className = ''
}: SequentialGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false)
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({})
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)

  // Unique category list
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category)))]
  
  // Filtered items based on selected category tab
  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category === selectedCategory)

  // Reset active index when category filter changes
  useEffect(() => {
    setActiveIndex(0)
  }, [selectedCategory])

  const handleNext = useCallback(() => {
    if (filteredItems.length === 0) return
    setActiveIndex((prev) => (prev + 1) % filteredItems.length)
  }, [filteredItems.length])

  const handlePrev = useCallback(() => {
    if (filteredItems.length === 0) return
    setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }, [filteredItems.length])

  // Slideshow timer
  useEffect(() => {
    if (!isAutoPlaying || filteredItems.length <= 1) return
    const timer = setInterval(() => {
      handleNext()
    }, autoPlayInterval)
    return () => clearInterval(timer)
  }, [isAutoPlaying, autoPlayInterval, filteredItems.length, handleNext])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'Escape') setLightboxItem(null)
  }

  const handleImageLoad = (id: string) => {
    setLoadedMap((prev) => ({ ...prev, [id]: true }))
  }

  const handleImageError = (id: string) => {
    setErrorMap((prev) => ({ ...prev, [id]: true }))
    setLoadedMap((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section
      className={`sequential-gallery ${className}`}
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Handloom Gallery Section"
    >
      <div className="sequential-gallery__stage container">
        
        {/* Gallery Intro & Dynamic Controls */}
        <div className="sequential-gallery__intro">
          <div className="gallery-header-badge">
            <span className="eyebrow">Look closer</span>
            <span className="gallery-counter">
              {String(activeIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
            </span>
          </div>

          <h2>One craft.<br />Three perspectives.</h2>
          <p>Focus changes as the story moves—from raw process and master artisans, to rich material textures.</p>

          {/* Category Tabs for Dynamic Filtering */}
          {categories.length > 2 && (
            <div className="sequential-gallery__categories" role="tablist" aria-label="Gallery categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  className={`gallery-category-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons: Arrows & Auto-play toggle */}
          <div className="sequential-gallery__actions">
            <button
              className="gallery-nav-btn"
              onClick={handlePrev}
              aria-label="Previous gallery image"
              title="Previous Perspective"
            >
              ←
            </button>
            <button
              className="gallery-nav-btn"
              onClick={handleNext}
              aria-label="Next gallery image"
              title="Next Perspective"
            >
              →
            </button>
            <button
              className={`gallery-autoplay-btn ${isAutoPlaying ? 'is-playing' : ''}`}
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? 'Pause automatic slideshow' : 'Start automatic slideshow'}
            >
              {isAutoPlaying ? '⏸ Pause' : '▶ Auto Play'}
            </button>
          </div>
        </div>

        {/* Gallery Image Display Frames */}
        <div className="sequential-gallery__frames">
          {filteredItems.map((frame, index) => {
            const isActive = index === activeIndex
            const isLoaded = loadedMap[frame.id]
            const hasError = errorMap[frame.id]
            const imgSrc = hasError
              ? (frame.fallbackImage || FALLBACK_IMAGE_DATA_URI)
              : frame.image

            return (
              <figure
                key={frame.id}
                className={`sequential-gallery__frame ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (!isActive) setActiveIndex(index)
                }}
              >
                {/* Skeleton Loader State */}
                {!isLoaded && (
                  <div className="gallery-skeleton-loader">
                    <div className="gallery-shimmer" />
                    <span className="skeleton-text">Loading textile capture...</span>
                  </div>
                )}

                {/* Main Image with Smooth Entrance & Object-Fit */}
                <div className="gallery-image-wrapper">
                  <img
                    src={imgSrc}
                    alt={frame.alt}
                    loading="lazy"
                    onLoad={() => handleImageLoad(frame.id)}
                    onError={() => handleImageError(frame.id)}
                    className={`gallery-image ${isLoaded ? 'is-loaded' : ''}`}
                  />

                  {/* Fallback indicator if network image failed */}
                  {hasError && (
                    <div className="gallery-error-badge">
                      <span>Local Fallback Asset</span>
                    </div>
                  )}
                </div>

                {/* Glassmorphism Caption Overlay */}
                <figcaption className="gallery-figcaption">
                  <div className="gallery-caption-header">
                    <span className="gallery-eyebrow">{frame.eyebrow}</span>
                    {frame.tag && <span className="gallery-tag">{frame.tag}</span>}
                  </div>
                  <strong>{frame.title}</strong>
                  <p>{frame.copy}</p>

                  <button
                    className="gallery-expand-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxItem(frame)
                    }}
                    aria-label={`Expand details for ${frame.title}`}
                  >
                    🔍 Expand View
                  </button>
                </figcaption>
              </figure>
            )
          })}
        </div>

        {/* Dynamic Progress Timeline Indicators */}
        <div className="sequential-gallery__progress">
          {filteredItems.map((frame, index) => (
            <button
              key={frame.id}
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`Switch to slide ${index + 1}: ${frame.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <i />
            </button>
          ))}
        </div>

      </div>

      {/* Lightbox High-Resolution View Modal */}
      {lightboxItem && (
        <div
          className="gallery-lightbox"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox for ${lightboxItem.title}`}
        >
          <div className="gallery-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-lightbox__close"
              onClick={() => setLightboxItem(null)}
              aria-label="Close Lightbox"
            >
              ✕
            </button>
            <img
              src={
                errorMap[lightboxItem.id]
                  ? (lightboxItem.fallbackImage || FALLBACK_IMAGE_DATA_URI)
                  : lightboxItem.image
              }
              alt={lightboxItem.alt}
            />
            <div className="gallery-lightbox__info">
              <span className="gallery-eyebrow">
                {lightboxItem.eyebrow} • {lightboxItem.category}
              </span>
              <h3>{lightboxItem.title}</h3>
              <p>{lightboxItem.copy}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
