import { useState } from 'react'
import { ButtonLink } from '../components/primitives/Button'

interface ClusterData {
  id: string
  name: string
  state: string
  region: string
  type: 'silk' | 'cotton' | 'ikat'
  history: string
  technique: string
  signatureMotif: string
  artisanCount: number
  image: string
  productName: string
  productPrice: string
  coordinates: { x: number; y: number } // Percentage position on India map canvas
}

const CLUSTERS: ClusterData[] = [
  {
    id: 'kanchipuram',
    name: 'Kanchipuram Guilds',
    state: 'Tamil Nadu',
    region: 'South',
    type: 'silk',
    history: 'Dating back over 400 years to the Chola Dynasty, famous for heavy mulberry silk and interlocking Korvai borders.',
    technique: 'Korvai Interlock & Pure Gold Zari Brocade',
    signatureMotif: 'Temple Borders (Gopuram) & Peacock (Mayil)',
    artisanCount: 120,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    productName: 'Royal Crimson Gold Zari Saree',
    productPrice: '₹24,500',
    coordinates: { x: 42, y: 78 },
  },
  {
    id: 'varanasi',
    name: 'Banaras Loom Atelier',
    state: 'Uttar Pradesh',
    region: 'North',
    type: 'silk',
    history: 'Centuries of royal patronage creating gold and silver metallic brocades using the intricate Kadwa technique.',
    technique: 'Kadwa Hand-Brocade & Tanchoi Weave',
    signatureMotif: 'Jal Floral Vines & Paisley (Kalka)',
    artisanCount: 240,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    productName: 'Banarasi Kadwa Silk Saree',
    productPrice: '₹28,000',
    coordinates: { x: 54, y: 38 },
  },
  {
    id: 'chanderi',
    name: 'Chanderi Weavers',
    state: 'Madhya Pradesh',
    region: 'Central',
    type: 'cotton',
    history: 'Famed since the Mughal era for sheer, feather-light textures woven from fine silk and unspun cotton yarns.',
    technique: 'Ek Nali Transparent Silk-Cotton Weave',
    signatureMotif: 'Ashrafi Gold Coin & Nalferma Motifs',
    artisanCount: 85,
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    productName: 'Chanderi Gold Coin Dupatta',
    productPrice: '₹8,900',
    coordinates: { x: 44, y: 46 },
  },
  {
    id: 'kutch',
    name: 'Kutch Kala Cotton',
    state: 'Gujarat',
    region: 'West',
    type: 'cotton',
    history: 'Rain-fed indigenous Kala Cotton handspun and dyed in natural organic indigo pits across the Rann of Kutch.',
    technique: 'Extra Weft Brocade & Indigo Vat Dyeing',
    signatureMotif: 'Geometric Mirrors & Reversible Borders',
    artisanCount: 95,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
    productName: 'Reversible Indigo Cotton Throw',
    productPrice: '₹4,200',
    coordinates: { x: 22, y: 45 },
  },
  {
    id: 'bhagalpur',
    name: 'Bhagalpur Tussar Silk',
    state: 'Bihar',
    region: 'East',
    type: 'silk',
    history: 'Known as the "Silk City" for over a century, producing wild forest Tussar with organic slub textures.',
    technique: 'Wild Tussar Hand-Reeling & Natural Slub Weave',
    signatureMotif: 'Organic Bark Texture & Natural Gold Patina',
    artisanCount: 160,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd858d9721d?q=80&w=1200&auto=format&fit=crop',
    productName: 'Wild Tussar Silk Stole',
    productPrice: '₹6,800',
    coordinates: { x: 65, y: 41 },
  },
  {
    id: 'pochampally',
    name: 'Pochampally Double Ikat',
    state: 'Telangana',
    region: 'South',
    type: 'ikat',
    history: 'UNESCO tentative heritage site renowned for precision Double Ikat tie-dye where both warp and weft are pattern-dyed.',
    technique: 'Pagdu Bandhu Double Ikat Tie-Dye',
    signatureMotif: 'Mathematical Geometric Diamonds',
    artisanCount: 110,
    image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?q=80&w=1200&auto=format&fit=crop',
    productName: 'Pochampally Double Ikat Saree',
    productPrice: '₹16,500',
    coordinates: { x: 44, y: 64 },
  },
  {
    id: 'jamdani',
    name: 'Bengal Jamdani',
    state: 'West Bengal',
    region: 'East',
    type: 'cotton',
    history: 'UNESCO Intangible Cultural Heritage. Supplementary weft technique where patterns are hand-drawn with bamboo needles.',
    technique: 'Discontinuous Weft Hand-Embroidery on Loom',
    signatureMotif: 'Panna Hazar (Thousand Emeralds) & Rose Sprigs',
    artisanCount: 180,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
    productName: 'Fine Jamdani Muslin Saree',
    productPrice: '₹19,200',
    coordinates: { x: 68, y: 46 },
  },
  {
    id: 'sambalpur',
    name: 'Sambalpuri Bandha',
    state: 'Odisha',
    region: 'East',
    type: 'ikat',
    history: 'Traditional tie-dye weaving from Odisha featuring intricate flora, fauna and shell motifs rendered with mathematical grace.',
    technique: 'Bandha Warp Ikat & Temple Borders',
    signatureMotif: 'Shankha (Conch) & Chakra (Wheel)',
    artisanCount: 130,
    image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=1200&auto=format&fit=crop',
    productName: 'Sambalpuri Ikat Silk Saree',
    productPrice: '₹14,800',
    coordinates: { x: 56, y: 52 },
  },
]

export function OriginMapPage() {
  const [selectedCluster, setSelectedCluster] = useState<ClusterData>(CLUSTERS[0])
  const [typeFilter, setTypeFilter] = useState<'all' | 'silk' | 'cotton' | 'ikat'>('all')

  const filteredClusters = CLUSTERS.filter(c => typeFilter === 'all' || c.type === typeFilter)

  return (
    <div className="origin-map-page" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      
      {/* Page Title */}
      <div className="container" style={{ marginBottom: '2.5rem' }}>
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>Heritage Geographies</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontFamily: 'var(--font-display)', margin: '0.4rem 0 1rem', lineHeight: 1.1 }}>
          Interactive Loom Origin Map
        </h1>
        <p style={{ maxWidth: '640px', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore India’s 8 major weaving clusters. Trace every fabric to its loom coordinates, century-old techniques, and master artisans.
        </p>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '2rem' }}>
          {(['all', 'silk', 'cotton', 'ikat'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setTypeFilter(f)}
              style={{
                background: typeFilter === f ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                color: typeFilter === f ? '#000' : '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '100px',
                padding: '8px 20px',
                fontSize: '0.82rem',
                fontWeight: typeFilter === f ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease',
              }}
            >
              {f === 'all' ? 'All 8 Clusters' : `${f} Weaves`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Cluster Detail Grid */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Interactive Vector Map Viewport */}
        <div
          style={{
            position: 'relative',
            height: '560px',
            background: '#0d0b09',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* Subtle Grid Lines Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(212,175,55,0.12) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }} />

          {/* India Outline Stylized Graphic */}
          <div style={{ position: 'relative', width: '85%', height: '85%', display: 'grid', placeItems: 'center' }}>
            <svg viewBox="0 0 500 550" style={{ width: '100%', height: '100%', opacity: 0.25, stroke: 'var(--gold)', strokeWidth: 1.5, fill: 'none' }}>
              <path d="M 180,60 L 250,50 L 320,80 L 380,140 L 350,220 L 390,260 L 330,300 L 280,380 L 220,480 L 190,440 L 160,340 L 110,260 L 90,200 L 130,120 Z" />
            </svg>

            {/* Render Interactive Cluster Pins */}
            {filteredClusters.map((cluster) => {
              const isSelected = cluster.id === selectedCluster.id
              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => setSelectedCluster(cluster)}
                  style={{
                    position: 'absolute',
                    left: `${cluster.coordinates.x}%`,
                    top: `${cluster.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: isSelected ? 10 : 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      width: isSelected ? '22px' : '14px',
                      height: isSelected ? '22px' : '14px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--gold)' : '#fff',
                      border: '3px solid #0d0b09',
                      boxShadow: isSelected ? '0 0 25px var(--gold), 0 0 50px var(--gold)' : '0 0 10px rgba(255,255,255,0.5)',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                  />
                  <span
                    style={{
                      marginTop: '4px',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {cluster.name.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>

          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>
            CLICK ANY CLUSTER PIN TO EXPLORE CRAFT HERITAGE
          </div>
        </div>

        {/* Right Selected Cluster Drawer & Details */}
        <div style={{ background: 'var(--surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
          
          <div style={{ position: 'relative', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <img src={selectedCluster.image} alt={selectedCluster.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--gold)', color: '#000', padding: '4px 12px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {selectedCluster.type} Weave
            </div>
          </div>

          <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '0.3rem' }}>
            {selectedCluster.state} · {selectedCluster.region} India
          </span>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: 0, fontWeight: 400 }}>
            {selectedCluster.name}
          </h2>

          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '1rem 0 1.5rem' }}>
            {selectedCluster.history}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', display: 'grid', gap: '0.8rem', fontSize: '0.85rem', marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Signature Technique</span>
              <strong style={{ color: '#fff', maxWidth: '240px', textAlign: 'right' }}>{selectedCluster.technique}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Key Motifs</span>
              <strong style={{ color: 'var(--gold)', maxWidth: '240px', textAlign: 'right' }}>{selectedCluster.signatureMotif}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Active Master Artisans</span>
              <strong style={{ color: '#fff' }}>{selectedCluster.artisanCount}+ Weavers</strong>
            </div>
          </div>

          {/* Featured Cluster Piece */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Cluster Piece</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>{selectedCluster.productName}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>{selectedCluster.productPrice}</div>
            </div>
            <ButtonLink to="/marketplace" variant="gold" style={{ padding: '10px 20px', fontSize: '0.82rem' }}>
              Shop Cluster
            </ButtonLink>
          </div>

        </div>

      </div>

    </div>
  )
}
