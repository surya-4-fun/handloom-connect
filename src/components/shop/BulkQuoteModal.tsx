import { useState } from 'react'
import { RawMaterial } from '../../types/rawMaterial'
import { Button } from '../primitives/Button'

interface BulkQuoteModalProps {
  material: RawMaterial | null
  onClose: () => void
}

export function BulkQuoteModal({ material, onClose }: BulkQuoteModalProps) {
  const [requestedQty, setRequestedQty] = useState(material ? material.minOrderQty * 5 : 20)
  const [artisanName, setArtisanName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!material) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2200)
  }

  return (
    <div className="support-modal-backdrop">
      <div className="support-modal-card" style={{ maxWidth: '580px' }}>
        
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--ink)', fontSize: '1.4rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📜</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)', margin: '0 0 8px' }}>
              Bulk Request Submitted!
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Your bulk supply inquiry for <strong>{requestedQty} {material.quantityUnit}</strong> of <strong>{material.name}</strong> has been routed directly to <strong>{material.supplier.name}</strong>.
            </p>
            <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', marginTop: '16px', fontSize: '0.82rem', color: 'var(--ink)' }}>
              Direct supplier quote reference: <code>B2B-{Math.floor(100000 + Math.random() * 900000)}</code>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                B2B Bulk Inquiry • Direct Guild Sourcing
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '4px 0 6px', fontWeight: 400 }}>
                Request Bulk Quantity
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                {material.name} ({material.supplier.name})
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="auth-form-group">
                  <label>Required Quantity ({material.quantityUnit}) *</label>
                  <input
                    type="number"
                    min={material.minOrderQty}
                    value={requestedQty}
                    onChange={e => setRequestedQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                    required
                  />
                </div>
                <div className="auth-form-group">
                  <label>Contact Name / Weaver *</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Weaver Ramanathan"
                    value={artisanName}
                    onChange={e => setArtisanName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="auth-form-group">
                  <label>Guild / Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Saraswathi Weavers Guild"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                  />
                </div>
                <div className="auth-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="weaver@atelier.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label>Phone Number / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label>Custom Loom Notes / Shade Matching</label>
                <textarea
                  rows={3}
                  placeholder="Specify yarn count, warp sizing, botanical shade reference, or loom delivery timeline..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                />
              </div>

              <Button type="submit" variant="gold" style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>
                Submit Bulk Quote Inquiry →
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
