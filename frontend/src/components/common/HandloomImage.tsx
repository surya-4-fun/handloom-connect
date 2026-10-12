import React, { useState, useEffect } from 'react'
import { getCategoryFallbackImage, CATEGORY_FALLBACKS } from '../../utils/imageUtils'

export interface HandloomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: string
  fallbackCategory?: string
  fallbackSrc?: string
}

export function HandloomImage({
  src,
  alt,
  category,
  fallbackCategory,
  fallbackSrc,
  className = '',
  style,
  loading = 'lazy',
  ...rest
}: HandloomImageProps) {
  const resolvedCategory = fallbackCategory || category
  const defaultFallback = fallbackSrc || getCategoryFallbackImage(resolvedCategory)

  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    return src && typeof src === 'string' && src.trim() ? src.trim() : defaultFallback
  })
  const [attempt, setAttempt] = useState(0)

  // Reset state when src or category props change
  useEffect(() => {
    const fallback = fallbackSrc || getCategoryFallbackImage(resolvedCategory)
    const validSrc = src && typeof src === 'string' && src.trim() ? src.trim() : fallback
    setCurrentSrc(validSrc)
    setAttempt(0)
  }, [src, resolvedCategory, fallbackSrc])

  const handleError = () => {
    const fallback = fallbackSrc || getCategoryFallbackImage(resolvedCategory)
    
    if (attempt === 0 && currentSrc !== fallback) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[HandloomImage] Failed to load image "${currentSrc}". Falling back to category placeholder "${fallback}".`)
      }
      setAttempt(1)
      setCurrentSrc(fallback)
    } else if (attempt === 1 && currentSrc !== CATEGORY_FALLBACKS.general) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[HandloomImage] Fallback failed for "${currentSrc}". Using general craft placeholder "${CATEGORY_FALLBACKS.general}".`)
      }
      setAttempt(2)
      setCurrentSrc(CATEGORY_FALLBACKS.general)
    } else {
      // Loop protection: do nothing further
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[HandloomImage] All fallback attempts exhausted for image request. Aborting further attempts.`)
      }
    }
  }

  const accessibleAlt = alt || 'Authentic handloom artisan creation'

  return (
    <img
      src={currentSrc}
      alt={accessibleAlt}
      loading={loading}
      className={`handloom-img ${className}`}
      style={{
        ...style,
        objectFit: style?.objectFit || 'cover',
      }}
      onError={handleError}
      {...rest}
    />
  )
}
