import { useState } from 'react'

interface Product {
  id: string
  title: string
  craft: string
  region: string
  material: string
  price: string
  image: string
  weaver: string
  description: string
  provenance: string
}

const LUXURY_PRODUCTS: Product[] = [
  {
    id: 'banarasi-zari-saree',
    title: 'Banarasi Real Zari Katan Silk Saree',
    craft: 'Banarasi Brocade',
    region: 'Varanasi, Uttar Pradesh',
    material: 'Pure Mulberry Silk & Fine Silver-Gold Zari',
    price: '₹48,500',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    weaver: 'Master Craftsman Rajeshwar Ansari',
    description: 'Woven over 42 days on a traditional pit loom using pure mulberry silk and electroplated gold-silver thread work inspired by Mughal flora.',
    provenance: 'GI Tagged · 100% Silk Mark Certified'
  },
  {
    id: 'kanchipuram-korvai',
    title: 'Kanchipuram Temple Border Korvai Silk',
    craft: 'Kanchipuram Silk',
    region: 'Kanchipuram, Tamil Nadu',
    material: 'Heavy Weight Mulberry Silk',
    price: '₹39,200',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800&auto=format&fit=crop',
    weaver: 'Saraswathi Weavers Guild',
    description: 'Interlocking warp technique (Korvai) creating sharp contrast borders with pure zari temple gopuram motifs along the pallu.',
    provenance: 'Handloom Mark Verified · Silk Mark Certified'
  },
  {
    id: 'pashmina-sozni-shawl',
    title: 'Kashmiri Hand-Embroidered Pashmina Shawl',
    craft: 'Sozni Needlework',
    region: 'Srinagar, Jammu & Kashmir',
    material: '100% Hand-Spun Changthangi Pashmina',
    price: '₹62,000',
    image: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=800&auto=format&fit=crop',
    weaver: 'Ghulam Rasool & Sons',
    description: 'Spun from high-altitude Ladakh pashm wool and hand-embroidered with micro Sozni needle stitches taking over 6 months to complete.',
    provenance: 'Authentic Kashmir Pashmina GI Tagged'
  },
  {
    id: 'tussar-hand-painted-stole',
    title: 'Tussar Silk Stole with Kalamkari Art',
    craft: 'Pen Kalamkari',
    region: 'Srikalahasti, Andhra Pradesh',
    material: 'Wild Tussar Raw Silk',
    price: '₹18,900',
    image: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=800&auto=format&fit=crop',
    weaver: 'Meera Devi Studio',
    description: 'Hand-drawn with bamboo reed pens using organic vegetable dyes and milk soak treatments on textured wild tussar silk.',
    provenance: 'Natural Dye Verified'
  },
  {
    id: 'jamdani-fine-cotton-saree',
    title: 'Dhakai Jamdani Fine Muslin Saree',
    craft: 'Jamdani Weave',
    region: 'Phulia, West Bengal',
    material: '100s Count Fine Handspun Cotton',
    price: '₹28,400',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    weaver: 'Phulia Master Weavers',
    description: 'Supplementary weft technique where delicate geometric motifs are hand-inserted into fine muslin like embroidery on the loom.',
    provenance: 'UNESCO Intangible Cultural Heritage Craft'
  },
  {
    id: 'bhadohi-wool-carpet',
    title: 'Bhadohi Heirloom Knotted Wool Carpet',
    craft: 'Hand-Knotted Carpet',
    region: 'Bhadohi, Uttar Pradesh',
    material: 'Bikaneri Wool & Organic Cotton Warp',
    price: '₹75,000',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800&auto=format&fit=crop',
    weaver: 'Bhadohi Artisan Collective',
    description: 'Densely hand-knotted at 120 knots per square inch using high-resilience washed wool with natural indigo and madder root dyes.',
    provenance: 'Fair Trade Certified Artisan Guild'
  }
]

export function MarketplacePage() {
  const [selectedCraft, setSelectedCraft] = useState<string>('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const crafts = ['All', 'Banarasi Brocade', 'Kanchipuram Silk', 'Sozni Needlework', 'Pen Kalamkari', 'Jamdani Weave']

  const filtered = selectedCraft === 'All' 
    ? LUXURY_PRODUCTS 
    : LUXURY_PRODUCTS.filter(p => p.craft === selectedCraft)

  return (
    <div className="marketplace-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>
      <div className="container">
        {/* Luxury Header Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '820px', marginInline: 'auto' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Atelier & Collection</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '1.2rem', color: 'var(--ink)' }}>
            Curated Heirloom Looms
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Every masterpiece is hand-woven by accredited Indian master artisans. Accompanied by digital provenance certification and direct artisan royalties.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          {crafts.map(craft => (
            <button
              key={craft}
              onClick={() => setSelectedCraft(craft)}
              style={{
                padding: '10px 22px',
                borderRadius: '100px',
                border: craft === selectedCraft ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.12)',
                background: craft === selectedCraft ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                color: craft === selectedCraft ? 'var(--gold-hover)' : 'var(--muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {craft}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
          {filtered.map(product => (
            <div
              key={product.id}
              style={{
                background: 'var(--canvas-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.4s var(--ease), border-color 0.4s ease, box-shadow 0.4s ease'
              }}
              className="luxury-card-hover"
            >
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s var(--ease)' }}
                />
                <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(10, 9, 8, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '100px' }}>
                  {product.craft}
                </span>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <small style={{ color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {product.region}
                </small>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.3 }}>
                  {product.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.55', marginBottom: '20px', flexGrow: 1 }}>
                  {product.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Price</span>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>{product.price}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="button button--secondary"
                    style={{ fontSize: '0.72rem', padding: '8px 16px' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(6, 5, 5, 0.9)', backdropFilter: 'blur(16px)', display: 'grid', placeItems: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--gold)', borderRadius: 'var(--radius-lg)', maxWidth: '680px', width: '100%', padding: '36px', position: 'relative', boxShadow: 'var(--shadow)' }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: '1px solid var(--border)', color: 'var(--ink)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
            <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{selectedProduct.craft}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '10px 0 16px', color: 'var(--ink)' }}>{selectedProduct.title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px' }}>{selectedProduct.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Master Weaver</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{selectedProduct.weaver}</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Provenance Certification</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{selectedProduct.provenance}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)' }}>{selectedProduct.price}</span>
              <button className="button button--primary" onClick={() => { alert(`Added ${selectedProduct.title} to your cart.`); setSelectedProduct(null); }}>
                Add to Atelier Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
