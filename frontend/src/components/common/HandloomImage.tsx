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
  const defaultFallback = fallbackSrc || getCategoryFallbackImage(fallbackCategory || category)

  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    return src && typeof src === 'string' && src.trim() ? src.trim() : defaultFallback
  })
  const [attempt, setAttempt] = useState(0)

  // Reset state when src or category props change
  useEffect(() => {
    const fallback = fallbackSrc || getCategoryFallbackImage(fallbackCategory || category)
    setCurrentSrc(src && typeof src === 'string' && src.trim() ? src.trim() : fallback)
    setAttempt(0)
  }, [src, category, fallbackCategory, fallbackSrc])

  const handleError = () => {
    const fallback = fallbackSrc || getCategoryFallbackImage(fallbackCategory || category)
    if (attempt === 0 && currentSrc !== fallback) {
      setAttempt(1)
      setCurrentSrc(fallback)
    } else if (attempt < 2 && currentSrc !== CATEGORY_FALLBACKS.general) {
      setAttempt(2)
      setCurrentSrc(CATEGORY_FALLBACKS.general)
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
