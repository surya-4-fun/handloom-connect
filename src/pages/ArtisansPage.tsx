interface Artisan {
  id: string
  name: string
  title: string
  location: string
  specialty: string
  experience: string
  bio: string
  image: string
}

const ARTISANS: Artisan[] = [
  {
    id: 'meera-devi',
    name: 'Meera Devi',
    title: 'Master Tussar Silk Weaver',
    location: 'Bhagalpur, Bihar',
    specialty: 'Handspun Tussar & Natural Dye Weaving',
    experience: '34 Years',
    bio: 'Preserving 3rd generation silk spinning traditions using indigenous cocoons and botanical plant extracts. Her textiles have been exhibited across global craft biennales.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'rajeshwar-ansari',
    name: 'Rajeshwar Ansari',
    title: 'Heritage Banarasi Master Weaver',
    location: 'Varanasi, Uttar Pradesh',
    specialty: 'Real Zari Katan Silk Brocade',
    experience: '42 Years',
    bio: 'Crafting complex Jacquard weaves and hand-drawn Naksha drawings on wooden pit looms. Each saree represents over a month of painstaking hand artistry.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'nila-collective',
    name: 'Nila Artisan Guild',
    title: 'Indigo Dye & Block Print Masters',
    location: 'Bhuj, Kutch, Gujarat',
    specialty: 'Natural Indigo Vat Fermentation & Ajrakh',
    experience: '28 Years',
    bio: 'Custodians of natural indigo vat fermentation passed down through generations. Utilizing mineral-rich water wells and carved teakwood blocks.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
  }
]

export function ArtisansPage() {
  return (
    <div className="artisans-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '820px', marginInline: 'auto' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Custodians of Heritage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Meet the Master Makers
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Attribution restores dignity and value to the human hands behind Indian handloom. Trace every warp and weft directly to the loom where it was born.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '36px' }}>
          {ARTISANS.map(artisan => (
            <div
              key={artisan.id}
              style={{
                background: 'var(--canvas-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src={artisan.image} alt={artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.95) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{artisan.location}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--ink)', marginTop: '4px' }}>{artisan.name}</h3>
                  <small style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{artisan.title}</small>
                </div>
              </div>

              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  {artisan.bio}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Experience</small>
                    <span style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{artisan.experience}</span>
                  </div>
                  <div>
                    <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Specialization</small>
                    <span style={{ fontSize: '0.82rem', color: 'var(--ink)' }}>{artisan.specialty}</span>
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
