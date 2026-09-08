import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

interface QRCodeViewProps {
  value: string
  size?: number
  className?: string
  alt?: string
}

export function QRCodeView({ value, size = 160, className = '', alt = 'Handloom Connect Story QR Code' }: QRCodeViewProps) {
  const [dataUrl, setDataUrl] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    if (!value || typeof value !== 'string') {
      setDataUrl('')
      setHasError(true)
      return
    }

    setHasError(false)
    QRCode.toDataURL(value, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: Math.max(128, size * 2), // High resolution for mobile scanning
      color: {
        dark: '#0A0908',
        light: '#FFFFFF'
      }
    })
      .then(url => {
        if (isMounted) {
          setDataUrl(url)
        }
      })
      .catch(err => {
        console.warn('[QRCodeView] Failed to generate QR code:', err)
        if (isMounted) {
          setHasError(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [value, size])

  if (hasError || !value) {
    return (
      <div
        className={`qr-code-view qr-code-view--fallback ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: '#ffffff',
          padding: '8px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.72rem'
        }}
        aria-label="QR Code unavailable"
      >
        <span>⚠️ QR Unavailable</span>
      </div>
    )
  }

  return (
    <div
      className={`qr-code-view ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: '#ffffff',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid rgba(212,175,55,0.3)',
            borderTopColor: 'var(--gold)',
            animation: 'spin 1s linear infinite'
          }}
          aria-label="Generating QR code"
        />
      )}
    </div>
  )
}
