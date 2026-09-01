import { useState, useEffect } from 'react'
import type { ShopProduct } from '../../types/shopTypes'
import type { BodyShape, AIWearPreviewResult } from '../../types/aiPreview'
import { generateProductWearPreview } from '../../services/aiPreviewService'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'

interface AIWearPreviewModalProps {
  product: ShopProduct | null
  isOpen: boolean
  onClose: () => void
}

const BODY_SHAPES: Array<{ id: BodyShape; label: string; desc: string }> = [
  { id: 'balanced', label: 'Balanced / Standard', desc: 'Even proportion distribution' },
  { id: 'petite', label: 'Petite', desc: 'Compact frame & shorter torso' },
  { id: 'athletic', label: 'Athletic', desc: 'Defined shoulders & structured frame' },
  { id: 'curvy', label: 'Curvy', desc: 'Fuller bust and hip silhouette' },
  { id: 'tall_slender', label: 'Tall & Slender', desc: 'Elongated frame & long limbs' },
  { id: 'unspecified', label: 'Prefer not to say', desc: 'General aesthetic drape' }
]

const LOADING_STEPS = [
  'Preparing your preview...',
  'Analyzing the selected handloom weave & drape geometry...',
  'Synthesizing wearable reference visualization...'
]

export function AIWearPreviewModal({ product, isOpen, onClose }: AIWearPreviewModalProps) {
  const [height, setHeight] = useState(165)
  const [weight, setWeight] = useState(60)
  const [bodyShape, setBodyShape] = useState<BodyShape>('balanced')
  
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStepIdx, setLoadingStepIdx] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState<AIWearPreviewResult | null>(null)

  // Reset modal state when product changes or modal reopens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('')
      setResult(null)
      setIsLoading(false)
      setLoadingStepIdx(0)
    }
  }, [isOpen, product?.id])

  // Animated loading step ticker
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setLoadingStepIdx(prev => (prev + 1) % LOADING_STEPS.length)
    }, 700)
    return () => clearInterval(interval)
  }, [isLoading])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen || !product) return null

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (height < 120 || height > 220) {
      setErrorMsg('Please enter a height between 120 cm and 220 cm.')
      return
    }
    if (weight < 35 || weight > 180) {
      setErrorMsg('Please enter a weight between 35 kg and 180 kg.')
      return
    }

    setIsLoading(true)
    setLoadingStepIdx(0)

    try {
      const data = await generateProductWearPreview({
        productId: product.id,
        height,
        weight,
        bodyShape
      })
      setResult(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to generate the wear preview right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setErrorMsg('')
  }

  return (
    <div
      className="support-modal-backdrop"
      style={{ zIndex: 1005 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-wear-preview-title"
    >
      <div
        className="support-modal-card"
        style={{
          maxWidth: result ? '820px' : '580px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--gold)',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.2)',
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'var(--ink)',
            fontSize: '1.4rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.3 : 0.8,
            padding: '4px 8px'
          }}
          aria-label="Close AI Wear Preview"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
            <Icon name="sparkles" size={14} /> AI Visualizer Atelier
          </span>
          <h2
            id="ai-wear-preview-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              margin: '6px 0 6px',
              fontWeight: 400,
              color: 'var(--ink)'
            }}
          >
            AI Wear Preview
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0 }}>
            {product.name} • <span style={{ color: 'var(--gold)' }}>{product.technique}</span>
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                border: '3px solid rgba(212,175,55,0.2)',
                borderTopColor: 'var(--gold)',
                animation: 'spin 1s linear infinite'
              }}
            />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '8px' }}>
              {LOADING_STEPS[loadingStepIdx]}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
              Synthesizing genuine textile motifs, warp textures, and physical reference drape.
            </p>
          </div>
        )}

        {/* RESULT VIEW */}
        {!isLoading && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Split Comparison View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
              {/* Product Reference */}
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                  Original Product Swatch
                </span>
                <img
                  src={result.product.image || product.images[0]}
                  alt={result.product.name}
                  style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                  {result.product.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold)' }}>
                  {result.product.craft}
                </div>
              </div>

              {/* Generated Wear Preview */}
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--gold)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center', position: 'relative' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>
                  ✨ AI Wear Preview Reference
                </span>
                <img
                  src={result.previewUrl}
                  alt={`AI wear preview for ${result.product.name}`}
                  style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--muted)' }}>
                  Reference: {result.attributes.height} cm • {result.attributes.weight} kg • {result.attributes.bodyShape}
                </div>
              </div>
            </div>

            {/* Prominent Legal & Technical Disclaimer */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>ℹ️</span>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '2px' }}>
                  AI-Generated Reference Visualization
                </strong>
                {result.disclaimer}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={handleReset} style={{ flex: 1 }}>
                🔄 Adjust Measurements & Regenerate
              </Button>
              <Button variant="primary" onClick={onClose} style={{ flex: 1 }}>
                Done Viewing
              </Button>
            </div>
          </div>
        )}

        {/* INPUT FORM VIEW */}
        {!isLoading && !result && (
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Height Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label htmlFor="user-height" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                  Height
                </label>
                <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 700 }}>
                  {height} cm ({Math.floor(height / 30.48)}&apos; {Math.round((height % 30.48) / 2.54)}&quot;)
                </span>
              </div>
              <input
                id="user-height"
                type="range"
                min={130}
                max={210}
                step={1}
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px' }}>
                <span>130 cm</span>
                <span>170 cm</span>
                <span>210 cm</span>
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label htmlFor="user-weight" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                  Weight
                </label>
                <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 700 }}>
                  {weight} kg ({Math.round(weight * 2.20462)} lbs)
                </span>
              </div>
              <input
                id="user-weight"
                type="range"
                min={40}
                max={140}
                step={1}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px' }}>
                <span>40 kg</span>
                <span>90 kg</span>
                <span>140 kg</span>
              </div>
            </div>

            {/* Body Shape Selector (Controlled Neutral List) */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>
                Body Silhouette Reference (Optional)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                {BODY_SHAPES.map(shape => {
                  const isSelected = bodyShape === shape.id
                  return (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setBodyShape(shape.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(212,175,55,0.18)' : 'var(--canvas)',
                        border: isSelected ? '1px solid var(--gold)' : '1px solid var(--border)',
                        color: isSelected ? 'var(--gold)' : 'var(--ink)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{shape.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '2px' }}>{shape.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notice */}
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
              * Body attributes are used solely for real-time visualization generation and are not stored permanently.
            </p>

            {/* Submit Action */}
            <div style={{ marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="button button--primary button--gold-glow"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
              >
                <Icon name="sparkles" size={16} /> Generate AI Wear Preview
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
