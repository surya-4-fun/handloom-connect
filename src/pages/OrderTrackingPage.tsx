import { useState } from 'react'
import { Button } from '../components/primitives/Button'

interface OrderDetails {
  id: string
  itemName: string
  itemImage: string
  price: string
  artisan: string
  cluster: string
  commissionDate: string
  estimatedDelivery: string
  currentStage: number
  totalHours: number
  completedHours: number
  silkMarkNo: string
  giTagNo: string
}

const DEMO_ORDERS: Record<string, OrderDetails> = {
  'HC-2026-8942': {
    id: 'HC-2026-8942',
    itemName: 'Royal Kanchipuram Gold Zari Saree',
    itemImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    price: '₹24,500',
    artisan: 'Master Weaver Ramanathan & Family',
    cluster: 'Kanchipuram Cluster, Tamil Nadu',
    commissionDate: 'July 12, 2026',
    estimatedDelivery: 'August 4, 2026',
    currentStage: 3, // 0-indexed stage 3 (Stage 4: Weaving in Progress)
    totalHours: 140,
    completedHours: 105,
    silkMarkNo: 'SM-TN-2026-9812',
    giTagNo: 'GI-KANCHI-4482',
  },
  'HC-2026-3105': {
    id: 'HC-2026-3105',
    itemName: 'Raw Tussar Silk Stole',
    itemImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    price: '₹6,800',
    artisan: 'Devi Prasad Weaving Collective',
    cluster: 'Bhagalpur Cluster, Bihar',
    commissionDate: 'July 18, 2026',
    estimatedDelivery: 'July 30, 2026',
    currentStage: 4,
    totalHours: 60,
    completedHours: 52,
    silkMarkNo: 'SM-BH-2026-1102',
    giTagNo: 'GI-BHAGAL-8821',
  },
}

const STAGES = [
  { title: '1. Raw Fiber Sourcing & Hank Washing', desc: 'Mulberry silk cocoons hand-reeled and degummed in mountain spring water.' },
  { title: '2. Organic Dyeing & Sun Drying', desc: 'Yarn dyed in small batches using natural madder root, indigo pits and marigold.' },
  { title: '3. Loom Setting & Warp Prep', desc: '2,400 warp threads manually aligned and threaded through heddle eyes.' },
  { title: '4. Master Weaving in Progress', desc: 'Over 105 hours of shuttle work completed with gold zari interlock.' },
  { title: '5. Quality Audit & GI Certification', desc: 'Handloom Mark verification, density inspection and weaver signature.' },
  { title: '6. Express Atelier Dispatch', desc: 'Padded heirloom packaging and direct dispatch with insurance.' },
]

export function OrderTrackingPage() {
  const [searchId, setSearchId] = useState('HC-2026-8942')
  const [activeOrder, setActiveOrder] = useState<OrderDetails>(DEMO_ORDERS['HC-2026-8942'])
  const [showCertModal, setShowCertModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanId = searchId.trim().toUpperCase()
    if (DEMO_ORDERS[cleanId]) {
      setActiveOrder(DEMO_ORDERS[cleanId])
      setErrorMsg('')
    } else {
      setErrorMsg(`Order ID "${searchId}" not found. Try demo ID: HC-2026-8942 or HC-2026-3105`)
    }
  }

  const progressPercent = Math.round((activeOrder.completedHours / activeOrder.totalHours) * 100)

  return (
    <div className="order-tracking-page" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      
      {/* Page Title */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>Transparency & Traceability</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontFamily: 'var(--font-display)', margin: '0.4rem 0 1rem', lineHeight: 1.1 }}>
          Loom Commission Tracker
        </h1>
        <p style={{ maxWidth: '640px', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Track every thread of your heirloom piece in real time from yarn sourcing to master weaver completion.
        </p>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginTop: '2rem', maxWidth: '560px' }}>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order Tracking ID (e.g. HC-2026-8942)"
            style={{
              flex: 1,
              background: 'var(--surface)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '14px 18px',
              color: '#fff',
              fontSize: '0.95rem',
            }}
          />
          <Button type="submit" variant="gold" style={{ padding: '14px 24px' }}>
            Track Loom
          </Button>
        </form>
        {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.6rem' }}>{errorMsg}</p>}
      </div>

      {/* Main Order Status Dashboard */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: Order & Artisan Card */}
        <div style={{ background: 'var(--surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
          
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '260px', marginBottom: '1.5rem' }}>
            <img src={activeOrder.itemImage} alt={activeOrder.itemName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.12em' }}>
              COMMISSION ID: {activeOrder.id}
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0, fontWeight: 400 }}>
            {activeOrder.itemName}
          </h2>
          <p style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 600, margin: '0.4rem 0 1.5rem' }}>
            {activeOrder.price}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', display: 'grid', gap: '0.8rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Master Weaver</span>
              <strong style={{ color: '#fff' }}>{activeOrder.artisan}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Cluster Origin</span>
              <strong style={{ color: '#fff' }}>{activeOrder.cluster}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Commission Date</span>
              <strong style={{ color: '#fff' }}>{activeOrder.commissionDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Est. Delivery</span>
              <strong style={{ color: 'var(--gold)' }}>{activeOrder.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Loom Hours Progress Bar */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              <span>Loom Hours Completed</span>
              <span>{activeOrder.completedHours} / {activeOrder.totalHours} hrs ({progressPercent}%)</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.6s ease' }} />
            </div>
          </div>

          {/* Certificate Button */}
          <Button
            variant="ghost"
            onClick={() => setShowCertModal(true)}
            style={{ width: '100%', marginTop: '1.8rem', textAlign: 'center', padding: '12px 20px', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}
          >
            📜 View Loom Certificate of Authenticity
          </Button>

        </div>

        {/* Right Column: 6-Stage Timeline */}
        <div style={{ background: 'var(--surface)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
          
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0 0 1.8rem', fontWeight: 400 }}>
            Craft Progress Timeline
          </h3>

          <div style={{ display: 'grid', gap: '1.6rem', position: 'relative' }}>
            
            {STAGES.map((stage, idx) => {
              const isDone = idx < activeOrder.currentStage
              const isCurrent = idx === activeOrder.currentStage
              const isPending = idx > activeOrder.currentStage

              return (
                <div
                  key={stage.title}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '1.2rem',
                    alignItems: 'start',
                    opacity: isPending ? 0.45 : 1,
                  }}
                >
                  {/* Status Indicator Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isDone ? 'var(--gold)' : isCurrent ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                      border: isCurrent ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,0.2)',
                      color: isDone ? '#000' : isCurrent ? 'var(--gold)' : 'var(--muted)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      boxShadow: isCurrent ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
                    }}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>

                  {/* Stage Details */}
                  <div style={{ background: isCurrent ? 'rgba(212,175,55,0.05)' : 'transparent', border: isCurrent ? '1px solid rgba(212,175,55,0.3)' : 'none', borderRadius: '12px', padding: isCurrent ? '1rem' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: isCurrent ? 'var(--gold)' : '#fff', fontWeight: isCurrent ? 600 : 400 }}>
                        {stage.title}
                      </h4>
                      {isCurrent && (
                        <span style={{ fontSize: '0.65rem', background: 'var(--gold)', color: '#000', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, letterSpacing: '0.1em' }}>
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: '0.4rem 0 0' }}>
                      {stage.desc}
                    </p>

                    {/* Live Weaver Note Box on Current Stage */}
                    {isCurrent && (
                      <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '0.8rem 1rem', borderLeft: '3px solid var(--gold)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
                        💬 <strong>Master Weaver Note:</strong> &quot;Warp tension set for interlocking Korvai gold border. Hand-shuttle weaving progressing at ~3.5 cm per hour.&quot;
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

          </div>

        </div>

      </div>

      {/* Digital Loom Certificate Modal */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ background: '#171411', border: '2px solid var(--gold)', borderRadius: '24px', padding: '2.5rem', maxWidth: '600px', width: '100%', position: 'relative', boxShadow: '0 30px 100px rgba(0,0,0,0.9)' }}>
            
            <button
              type="button"
              onClick={() => setShowCertModal(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(212,175,55,0.3)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Government Registered Authentic Handloom
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '0.4rem 0 0.2rem', fontWeight: 400 }}>
                Certificate of Loom Authenticity
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                Issued by Handloom Connect Atelier & Ministry of Textiles Guild
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--muted)' }}>Product Name:</span>
                <strong>{activeOrder.itemName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--muted)' }}>Silk Mark Certification #:</span>
                <strong style={{ color: 'var(--gold)' }}>{activeOrder.silkMarkNo}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--muted)' }}>GI Tag Registry #:</span>
                <strong style={{ color: 'var(--gold)' }}>{activeOrder.giTagNo}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--muted)' }}>Master Weaver Signature:</span>
                <strong>{activeOrder.artisan}</strong>
              </div>
            </div>

            <Button variant="gold" onClick={() => setShowCertModal(false)} style={{ width: '100%', textAlign: 'center' }}>
              Download Signed Certificate PDF
            </Button>

          </div>
        </div>
      )}

    </div>
  )
}
