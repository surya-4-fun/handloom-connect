import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { SHOP_ARTISANS } from '../mocks/shopData'
import { useFollowArtisans } from '../hooks/useFollowArtisans'

export function ArtisansPage() {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useFollowArtisans()

  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [activeTab, setActiveTab] = useState<'all' | 'masters' | 'collectives'>('all')

  const regions = useMemo(() => {
    const set = new Set<string>()
    SHOP_ARTISANS.forEach(a => {
      const city = a.region.split(',')[0].trim()
      set.add(city)
    })
    return ['all', ...Array.from(set)]
  }, [])

  const filteredArtisans = useMemo(() => {
    return SHOP_ARTISANS.filter(artisan => {
      // Tab filter
      if (activeTab === 'masters' && artisan.isCollective) return false
      if (activeTab === 'collectives' && !artisan.isCollective) return false

      // Region filter
      if (selectedRegion !== 'all' && !artisan.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesName = artisan.name.toLowerCase().includes(query)
        const matchesCraft = artisan.craft.toLowerCase().includes(query)
        const matchesRegion = artisan.region.toLowerCase().includes(query)
        const matchesSpecialty = (artisan.specialty || '').toLowerCase().includes(query)
        if (!matchesName && !matchesCraft && !matchesRegion && !matchesSpecialty) {
          return false
        }
      }

      return true
    })
  }, [search, selectedRegion, activeTab])

  return (
    <div className="artisans-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="container">
        
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '820px', marginInline: 'auto' }}>
          <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Custodians of Heritage</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Meet India's Master Weavers
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Attribution restores dignity to human hands. Discover master weavers, indigenous dyer collectives, and regional craft guilds preserving centuries of Indian textile lineage.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="artisan-filter-bar">
          
          {/* Segment Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`artisan-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Artisans ({SHOP_ARTISANS.length})
            </button>
            <button
              className={`artisan-tab-btn ${activeTab === 'masters' ? 'active' : ''}`}
              onClick={() => setActiveTab('masters')}
            >
              Master Weavers
            </button>
            <button
              className={`artisan-tab-btn ${activeTab === 'collectives' ? 'active' : ''}`}
              onClick={() => setActiveTab('collectives')}
            >
              Craft Collectives
            </button>
          </div>

          {/* Search & Region Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                className="artisan-search-input"
                placeholder="Search maker, craft or region..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Select */}
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              style={{
                background: 'var(--canvas)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--ink)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Regions</option>
              {regions.filter(r => r !== 'all').map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>

          </div>

        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Showing <strong>{filteredArtisans.length}</strong> verified artisans
        </div>

        {/* Artisans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {filteredArtisans.map(artisan => {
            const following = isFollowing(artisan.id)

            return (
              <div
                key={artisan.id}
                style={{
                  background: 'var(--canvas-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, border-color 0.25s ease',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/artisans/${artisan.id}`)}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={artisan.image} alt={artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.95) 0%, transparent 60%)' }} />
                  
                  {/* Badge */}
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.12em', fontWeight: 700 }}>
                    {artisan.isCollective ? 'GUILD' : 'MASTER'}
                  </div>

                  {/* Follow Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFollow(artisan.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: following ? 'var(--gold)' : '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer'
                    }}
                    aria-label="Follow Artisan"
                  >
                    <Icon name={following ? 'heart-filled' : 'heart'} size={16} />
                  </button>

                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{artisan.region}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--ink)', margin: '2px 0 0' }}>{artisan.name}</h3>
                    <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem' }}>{artisan.title || artisan.craft}</small>
                  </div>
                </div>

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    {artisan.bio}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Experience</small>
                      <span style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{artisan.experience}</span>
                    </div>
                    <span style={{ color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
