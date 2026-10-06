import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/primitives/Button'
import { fetchRawMaterials } from '../services/rawMaterialService'
import { RawMaterial } from '../types/rawMaterial'
import { RawMaterialDetailModal } from '../components/shop/RawMaterialDetailModal'
import { BulkQuoteModal } from '../components/shop/BulkQuoteModal'
import { useCart } from '../hooks/useCart'

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'All Raw Materials', icon: '🧵' },
  { id: 'Silk Yarn', label: 'Silk Yarn', icon: '✨' },
  { id: 'Cotton Yarn', label: 'Cotton Yarn', icon: '🌿' },
  { id: 'Wool', label: 'Wool & Pashm', icon: '🏔️' },
  { id: 'Natural Dyes', label: 'Natural Dyes', icon: '🌺' },
  { id: 'Indigo', label: 'Organic Indigo', icon: '🌊' },
  { id: 'Weaving Materials', label: 'Zari & Shuttles', icon: '⚙️' },
  { id: 'Craft Accessories', label: 'Blocks & Cards', icon: '🎨' }
]

export function RawMaterialsPage() {
  const { addToCart } = useCart()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedQuality, setSelectedQuality] = useState<string>('all')
  const [inStockOnly] = useState(false)
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'min-order'>('featured')

  const [inspectMaterial, setInspectMaterial] = useState<RawMaterial | null>(null)
  const [bulkMaterial, setBulkMaterial] = useState<RawMaterial | null>(null)

  const [materials, setMaterials] = useState<RawMaterial[]>([])
  const [allMaterials, setAllMaterials] = useState<RawMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all once for origins extraction
  useEffect(() => {
    fetchRawMaterials().then(data => setAllMaterials(data || []))
  }, [])

  // Fetch filtered
  useEffect(() => {
    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      fetchRawMaterials({
        category: selectedCategory,
        origin: selectedRegion,
        quality: selectedQuality,
        inStockOnly,
        search,
        sort: sortOption
      })
        .then(data => setMaterials(data || []))
        .catch(() => setMaterials([]))
        .finally(() => setIsLoading(false))
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [search, selectedCategory, selectedRegion, selectedQuality, inStockOnly, sortOption])

  const origins = useMemo(() => {
    const set = new Set<string>()
    allMaterials.forEach(m => {
      const city = m.origin.split(',')[0].trim()
      set.add(city)
    })
    return ['all', ...Array.from(set)]
  }, [allMaterials])

  return (
    <div className="raw-materials-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="container">
        
        {/* B2B Weaver Banner Hero */}
        <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <span style={{ background: 'var(--gold)', color: '#000', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              B2B Guild Supply Engine
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', margin: '12px 0 10px', fontWeight: 400 }}>
              Raw Material Marketplace for Artisans
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Source unadulterated Mulberry filaments, wild forest Tussar silk, organic Kutchi indigo vats, and 24K electroplated gold zari directly from verified artisan reelers and dyer cooperatives.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--ink)' }}>
              <span>✓ <strong>100% Direct Guild Trade</strong></span>
              <span>✓ <strong>GI Authenticated Origin</strong></span>
              <span>✓ <strong>Low Artisan MOQs</strong></span>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '30px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '100px',
                background: selectedCategory === cat.id ? 'var(--ink)' : 'var(--canvas-secondary)',
                color: selectedCategory === cat.id ? 'var(--canvas)' : 'var(--ink)',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Multi-Facet Search & Filter Control Bar */}
        <div className="artisan-filter-bar" style={{ marginBottom: '30px' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className="artisan-search-input"
              placeholder="Search yarn denier, dye, supplier or origin..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: '300px' }}
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

          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--ink)', fontSize: '0.88rem' }}
            >
              <option value="all">All Origins / Regions</option>
              {origins.filter(o => o !== 'all').map(orig => (
                <option key={orig} value={orig}>{orig}</option>
              ))}
            </select>

            {/* Quality Grade Filter */}
            <select
              value={selectedQuality}
              onChange={e => setSelectedQuality(e.target.value)}
              style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--ink)', fontSize: '0.88rem' }}
            >
              <option value="all">All Quality Grades</option>
              <option value="Grade AAA Pure">Grade AAA Pure</option>
              <option value="Certified Organic">Certified Organic</option>
              <option value="Hand-spun Artisan">Hand-spun Artisan</option>
              <option value="Pure Metallic">Pure Metallic</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'min-order')}
              style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--ink)', fontSize: '0.88rem' }}
            >
              <option value="featured">Featured Supply</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="min-order">Lowest Minimum Order</option>
            </select>

          </div>

        </div>

        {/* Counter */}
        <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Found <strong>{materials.length}</strong> raw material listings</span>
          <Link to="/materials" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'underline' }}>
            Read Textile Science Guide →
          </Link>
        </div>

        {/* Raw Materials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>Loading...</div>
          ) : materials.map(mat => (
            <div
              key={mat.id}
              style={{
                background: 'var(--canvas-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={mat.images[0]} alt={mat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.9) 0%, transparent 60%)' }} />
                
                {mat.badge && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--gold)', color: '#000', padding: '3px 8px', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                    {mat.badge}
                  </span>
                )}

                <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{mat.origin}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', margin: '2px 0 0', fontWeight: 400 }}>{mat.name}</h3>
                </div>
              </div>

              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>
                      {mat.displayPrice}
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>/ {mat.quantityUnit}</span>
                  </div>

                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '14px' }}>
                    {mat.description.substring(0, 110)}...
                  </p>

                  <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Supplier:</span>
                      <strong style={{ color: 'var(--ink)' }}>{mat.supplier.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Min Order (MOQ):</span>
                      <strong style={{ color: 'var(--gold)' }}>{mat.minOrderQty} {mat.quantityUnit.split(' ')[0]}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Button variant="secondary" onClick={() => setInspectMaterial(mat)} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', padding: '8px' }}>
                    Inspect Specs
                  </Button>
                  <Button variant="gold" onClick={() => setBulkMaterial(mat)} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', padding: '8px' }}>
                    Request Bulk
                  </Button>
                  <Link to={`/ai-fashion-assistant?materialId=${mat.id}`} className="button button--secondary" style={{ width: '100%', textAlign: 'center', fontSize: '0.75rem', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span>✨</span> Consult AI on Material
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Inspect Detail Modal */}
      <RawMaterialDetailModal
        material={inspectMaterial}
        onClose={() => setInspectMaterial(null)}
        onAddToCart={(id) => addToCart(id, 1)}
        onRequestBulk={(mat) => setBulkMaterial(mat)}
      />

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        material={bulkMaterial}
        onClose={() => setBulkMaterial(null)}
      />

    </div>
  )
}
