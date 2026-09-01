import { RawMaterial } from '../../types/rawMaterial'
import { Button } from '../primitives/Button'

interface RawMaterialDetailModalProps {
  material: RawMaterial | null
  onClose: () => void
  onAddToCart: (materialId: string) => void
  onRequestBulk: (material: RawMaterial) => void
}

export function RawMaterialDetailModal({
  material,
  onClose,
  onAddToCart,
  onRequestBulk
}: RawMaterialDetailModalProps) {
  if (!material) return null

  return (
    <div className="support-modal-backdrop">
      <div className="support-modal-card" style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}>
        
        <button
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'grid', placeItems: 'center' }}
        >
          ✕
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', alignItems: 'stretch' }}>
          
          {/* Image Left */}
          <div style={{ position: 'relative', background: '#000' }}>
            <img src={material.images[0]} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {material.badge && (
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--gold)', color: '#000', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em' }}>
                {material.badge}
              </span>
            )}
          </div>

          {/* Details Right */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {material.category} • {material.origin}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--ink)', margin: '6px 0 10px', fontWeight: 400 }}>
                {material.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>
                  {material.displayPrice}
                </strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>/ {material.quantityUnit}</span>
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--ink)' }}>
                  MOQ: {material.minOrderQty} {material.quantityUnit.split(' ')[0]}
                </span>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '18px' }}>
                {material.description}
              </p>

              {/* Specifications Block */}
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--muted)', display: 'block' }}>Quality Grade:</span>
                  <strong style={{ color: 'var(--ink)' }}>{material.quality}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', display: 'block' }}>Denier / Yarn Count:</span>
                  <strong style={{ color: 'var(--ink)' }}>{material.denierOrCount || 'Artisan Grade'}</strong>
                </div>
              </div>

              {/* Verified Supplier Information Card */}
              <div style={{ background: 'rgba(212, 175, 55, 0.06)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>🏢 {material.supplier.name}</strong>
                  {material.supplier.verifiedGI && (
                    <span style={{ background: 'var(--gold)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                      GI VERIFIED
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0 }}>
                  {material.supplier.location} • Specialty: {material.supplier.specialty}
                </p>
              </div>

            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="primary" onClick={() => { onAddToCart(material.id); onClose(); }} style={{ flex: 1, textAlign: 'center' }}>
                Add to Material Cart
              </Button>
              <Button variant="secondary" onClick={() => onRequestBulk(material)} style={{ flex: 1, textAlign: 'center' }}>
                Request Bulk Quote
              </Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
