import { useState } from 'react'
import { Icon } from '../components/primitives/Icon'
import { Button, ButtonLink } from '../components/primitives/Button'

interface FabricItem {
  id: string
  name: string
  category: string
  price: string
  artisan: string
  cluster: string
  image: string
  zoomImage: string
  description: string
  threadCount: string
  weaveType: string
}

const FABRIC_ITEMS: FabricItem[] = [
  {
    id: 'kanchipuram-gold',
    name: 'Kanchipuram Crimson Zari Saree',
    category: 'Sarees',
    price: '₹24,500',
    artisan: 'Master Weaver Ramanathan',
    cluster: 'Kanchipuram, Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    zoomImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    description: 'Pure Mulberry Silk woven with pure gold zari threads featuring interlocking Korvai borders.',
    threadCount: '240 GSM · Pure Mulberry',
    weaveType: 'Heavy Korvai Double Warp',
  },
  {
    id: 'tussar-raw-silk',
    name: 'Raw Tussar Silk Stole',
    category: 'Stoles & Scarves',
    price: '₹6,800',
    artisan: 'Devi Prasad & Family',
    cluster: 'Bhagalpur, Bihar',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    zoomImage: 'https://images.unsplash.com/photo-1606760227091-3dd858d9721d?q=80&w=1200&auto=format&fit=crop',
    description: 'Wild forest Tussar silk with characteristic slub texture and organic gold patina.',
    threadCount: '160 GSM · Wild Tussar',
    weaveType: 'Hand-reeled Slub Weave',
  },
  {
    id: 'reversible-indigo-throw',
    name: 'Reversible Indigo Cotton Throw',
    category: 'Home Atelier',
    price: '₹4,200',
    artisan: 'Meghwal Weavers Collective',
    cluster: 'Kutch, Gujarat',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
    zoomImage: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?q=80&w=1200&auto=format&fit=crop',
    description: 'Organic Kala Cotton dyed in natural indigo pits, featuring dual-sided geometric motifs.',
    threadCount: '320 GSM · Kala Organic Cotton',
    weaveType: 'Extra Weft Brocade',
  },
  {
    id: 'chanderi-sheer-dupatta',
    name: 'Chanderi Gold Motif Dupatta',
    category: 'Dupattas',
    price: '₹8,900',
    artisan: 'Ansari Weaving Guild',
    cluster: 'Chanderi, Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    zoomImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    description: 'Feather-light silk-cotton body ornamented with hand-hammered Ashrafi coin buttis.',
    threadCount: '90 GSM · Silk Cotton',
    weaveType: 'Ek Nali Sheer Weave',
  },
]

type LightMode = 'warm' | 'daylight' | 'gala' | 'interior'

export function ARStudioPage() {
  const [selectedItem, setSelectedItem] = useState<FabricItem>(FABRIC_ITEMS[0])
  const [lightMode, setLightMode] = useState<LightMode>('warm')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isARActive, setIsARActive] = useState(false)
  const [rotationY, setRotationY] = useState(0)
  const [snapshotToast, setSnapshotToast] = useState(false)

  const getLightingFilter = () => {
    switch (lightMode) {
      case 'daylight':
        return 'brightness(1.08) contrast(1.05) saturate(1.1)'
      case 'gala':
        return 'sepia(0.2) brightness(0.95) contrast(1.15) hue-rotate(-10deg) saturate(1.4)'
      case 'interior':
        return 'brightness(0.92) contrast(0.98) saturate(0.9)'
      case 'warm':
      default:
        return 'brightness(1.02) contrast(1.08) sepia(0.08) saturate(1.2)'
    }
  }

  const handleTakeSnapshot = () => {
    setSnapshotToast(true)
    setTimeout(() => setSnapshotToast(false), 3500)
  }

  return (
    <div className="ar-studio-page" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      
      {/* Page Header */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>Interactive Studio</p>
        <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)', fontFamily: 'var(--font-display)', margin: '0.4rem 0 1rem', lineHeight: 1.1 }}>
          Virtual Drape & AR Studio
        </h1>
        <p style={{ maxWidth: '640px', color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Observe how authentic handloom weaves react to light, motion, and spatial depth before choosing your bespoke heirloom piece.
        </p>
      </div>

      {/* Main Studio Viewport */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Interactive 3D / Viewport Frame */}
        <div style={{ position: 'relative', background: '#0e0c0a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.12)', padding: '1.5rem', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
          
          {/* Top Bar Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', zIndex: 10, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: isARActive ? '#10b981' : 'var(--gold)', boxShadow: isARActive ? '0 0 12px #10b981' : '0 0 12px var(--gold)' }} />
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                {isARActive ? 'WebXR Live AR Viewfinder' : '3D Studio Canvas'}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setIsARActive(!isARActive)}
                style={{
                  background: isARActive ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                  color: isARActive ? '#000' : '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '100px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon name="sparkles" size={14} />
                {isARActive ? 'Exit AR Mode' : 'Launch AR Viewfinder'}
              </button>
            </div>
          </div>

          {/* Canvas Display Viewport */}
          <div
            style={{
              position: 'relative',
              height: '520px',
              borderRadius: '16px',
              overflow: 'hidden',
              background: isARActive ? '#050505' : 'radial-gradient(circle at 50% 40%, #1f1b16 0%, #0a0908 100%)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'grab',
            }}
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                setRotationY((prev) => prev + e.movementX * 0.4)
              }
            }}
          >
            {/* AR Reticle Overlay if active */}
            {isARActive && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: '2px dashed rgba(212,175,55,0.4)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', padding: '1rem', zIndex: 5 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.15em' }}>[AR DETECTED: PLANE FOUND]</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.15em' }}>SCALE 1.00x</span>
              </div>
            )}

            {/* Fabric Texture Visual */}
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `rotateY(${rotationY}deg) scale(${zoomLevel / 100})`,
                transition: 'transform 0.1s ease-out, filter 0.4s ease',
                filter: getLightingFilter(),
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <img
                src={zoomLevel > 150 ? selectedItem.zoomImage : selectedItem.image}
                alt={selectedItem.name}
                style={{
                  width: '85%',
                  height: '85%',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.7), inset 0 0 2px rgba(255,255,255,0.3)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Rotation Drag Cue */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', padding: '6px 16px', fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', pointerEvents: 'none' }}>
              Drag to Rotate · Scroll to Zoom ({zoomLevel}%)
            </div>
          </div>

          {/* Lighting & Zoom Controls Bar */}
          <div style={{ marginTop: '1.2rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            
            {/* Lighting Preset Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                Lighting Atmosphere
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {(['warm', 'daylight', 'gala', 'interior'] as LightMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLightMode(mode)}
                    style={{
                      background: lightMode === mode ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                      color: lightMode === mode ? '#000' : '#fff',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px 4px',
                      fontSize: '0.72rem',
                      fontWeight: lightMode === mode ? 600 : 400,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Slider & Actions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span>Weave Magnifier</span>
                <span>{zoomLevel}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Snapshot Button */}
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {selectedItem.threadCount}
            </span>
            <Button variant="ghost" onClick={handleTakeSnapshot} style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
              📸 Capture High-Res Drape Snapshot
            </Button>
          </div>

        </div>

        {/* Right Product Selection & Customization Info */}
        <div style={{ background: 'var(--surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
          
          {/* Active Piece Details */}
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '0.4rem' }}>
            {selectedItem.category} · {selectedItem.cluster}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: 0, fontWeight: 400 }}>
            {selectedItem.name}
          </h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 600, margin: '0.6rem 0 1.2rem' }}>
            {selectedItem.price}
          </p>

          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {selectedItem.description}
          </p>

          {/* Artisan & Weave Specifications */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', marginBottom: '2rem', display: 'grid', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--muted)' }}>Master Artisan</span>
              <strong style={{ color: '#fff' }}>{selectedItem.artisan}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--muted)' }}>Cluster Origin</span>
              <strong style={{ color: '#fff' }}>{selectedItem.cluster}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--muted)' }}>Weave Specification</span>
              <strong style={{ color: 'var(--gold)' }}>{selectedItem.weaveType}</strong>
            </div>
          </div>

          {/* Fabric Selector Items */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted)', marginBottom: '0.8rem' }}>
              Select Drape Sample
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {FABRIC_ITEMS.map((item) => {
                const isSelected = item.id === selectedItem.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)',
                      padding: 0,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.35)' : 'none',
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            <ButtonLink to="/marketplace" variant="gold" style={{ width: '100%', textAlign: 'center', padding: '14px 24px' }}>
              Acquire This Piece · {selectedItem.price}
            </ButtonLink>
            <ButtonLink to="/order-tracking" variant="ghost" style={{ width: '100%', textAlign: 'center', padding: '12px 24px' }}>
              Commission Custom Weave Timeline
            </ButtonLink>
          </div>

        </div>

      </div>

      {/* Snapshot Toast Feedback */}
      {snapshotToast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--gold)', color: '#000', padding: '14px 24px', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 100 }}>
          ✨ Snapshot saved to your studio gallery!
        </div>
      )}

    </div>
  )
}
