import { Link } from 'react-router-dom'

interface Material {
  id: string
  name: string
  origin: string
  characteristics: string
  sustainability: string
  image: string
  notes: string
}

const MATERIALS: Material[] = [
  {
    id: 'tussar-silk',
    name: 'Wild Tussar Silk (Kosa)',
    origin: 'Bhagalpur & Chota Nagpur Plateau',
    characteristics: 'Rich golden texture, breathable thermal weave, natural slubs and matte lustre.',
    sustainability: '100% Wild Harvested Silkworm Cocoons · Zero Chemical Bleach',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800&auto=format&fit=crop',
    notes: 'Known for its distinctive golden sheen and porous weave structure that keeps cool in summer and warm in winter.'
  },
  {
    id: 'organic-indigo',
    name: 'Organic Fermented Indigo Dye',
    origin: 'Kutch, Gujarat & Tamil Nadu',
    characteristics: 'Living organic vat dye yielding deep navy to midnight hues with subtle light patina over time.',
    sustainability: 'Indigofera Tinctoria Plant Dye · Zero Synthetic Fixatives',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop',
    notes: 'Fermented in earthen vats using natural jaggery and lime. The living dye bonds with organic cotton and silk fibers.'
  },
  {
    id: 'pashm-wool',
    name: 'Ladakhi Pashm Fine Wool',
    origin: 'Changthang Plateau, Ladakh (14,000+ ft)',
    characteristics: 'Micron fineness under 14.5 microns, featherweight warmth, butter-soft touch.',
    sustainability: 'Ethically Combed Winter Undercoat · Artisan Hand-Spun',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    notes: 'Harvested naturally as Changthangi goats shed their winter coat during spring high altitude molting.'
  }
]

export function MaterialsPage() {
  return (
    <div className="materials-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '820px', marginInline: 'auto' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Textile Science & Nature</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Pure Fibres & Natural Botanicals
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            We work exclusively with unadulterated natural silk, hand-spun high-altitude wool, and plant dyes. Texture tells the truth of human hands and organic earth.
          </p>

          {/* B2B Artisan Procurement Banner Callout */}
          <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--gold)', borderRadius: 'var(--radius-lg)', padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'left', flex: '1 1 340px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: '4px' }}>
                🧵 B2B Raw Material Supply Engine
              </span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--ink)', display: 'block', marginBottom: '4px', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
                Looking to source yarn, dyes, zari, or weaving tools?
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.5', display: 'block' }}>
                Procure Grade AAA Mulberry Silk hanks, Kala organic cotton, fermented indigo, and gold zari spools directly from verified supplier guilds.
              </span>
            </div>
            <Link to="/raw-materials" className="button button--gold" style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}>
              Visit B2B Raw Material Marketplace →
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '30px' }}>
          {MATERIALS.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--canvas-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 1fr) 2fr',
                gap: '24px'
              }}
            >
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{item.origin}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', margin: '8px 0 14px', color: 'var(--ink)' }}>{item.name}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '16px' }}>{item.notes}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tactile Profile</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{item.characteristics}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sustainability Standard</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{item.sustainability}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
