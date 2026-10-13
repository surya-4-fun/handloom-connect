import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import handloomEmblem from '../../assets/images/handloom-logo-emblem.png'
import heroArtisanImg from '../../assets/images/hero-artisan.jpg'
import textilesImg from '../../assets/images/textiles.jpg'
import artisanPortraitImg from '../../assets/images/artisan-portrait.jpg'

interface StoryChapter {
  id: string
  title: string
  subtitle: string
  quote: string
  craft: string
  region: string
  image: string
}

const chapters: StoryChapter[] = [
  {
    id: 'pit-loom',
    title: 'The Master Pit Loom',
    subtitle: 'Varanasi • Uttar Pradesh',
    quote: 'Every thread tells a story of generations. Our hands give breath to what machines can never feel.',
    craft: 'Kadhwa Zari & Pure Silk',
    region: 'Varanasi',
    image: heroArtisanImg,
  },
  {
    id: 'kanchipuram',
    title: 'The Sacred Temple Weaves',
    subtitle: 'Kanchipuram • Tamil Nadu',
    quote: 'Interlocking warp and weft with ancient temple borders, honoring five millennia of sacred artisanal ritual.',
    craft: 'Pure Mulberry Silk & Korvai Border',
    region: 'Kanchipuram',
    image: '/images/products/kanchipuram-korvai.jpg',
  },
  {
    id: 'banarasi-gold',
    title: 'The Royal Gold Zari',
    subtitle: 'Mughal Heritage Ateliers',
    quote: 'Woven with real silver and gold gilded threads, transforming raw cocoons into heirloom ceremonial drapery.',
    craft: 'Banarasi Brocade & Floral Jaal',
    region: 'Ganga Valley',
    image: '/images/products/banarasi-zari-saree.jpg',
  },
  {
    id: 'artisan-collective',
    title: 'Direct Artisan Living Wages',
    subtitle: 'Fair Trade • GI-Certified',
    quote: 'Connecting India’s master weavers directly with discerning patrons worldwide, eliminating middlemen forever.',
    craft: 'Handloom Authenticity Verified',
    region: 'Pan-India Weaving Clusters',
    image: artisanPortraitImg || textilesImg,
  },
]

export function StorytellingAuthPanel() {
  const [activeIdx, setActiveIdx] = useState(0)

  // Auto-advance through chapters every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % chapters.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const current = chapters[activeIdx]

  return (
    <div className="storytelling-auth-panel" aria-label="Handloom Connect Heritage Storytelling">
      {/* Background Imagery with Smooth Crossfade */}
      <div className="storytelling-bg-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="storytelling-bg-slide"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={current.image}
              alt={current.title}
              className="storytelling-bg-img"
              loading="eager"
            />
            {/* Theme-Adaptive Vignette & Fabric Grain Overlay */}
            <div className="storytelling-vignette" />
            <div className="storytelling-weave-overlay" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Narrative Editorial Layer */}
      <div className="storytelling-content">
        {/* Brand Header */}
        <div className="storytelling-brand-lockup">
          <div className="storytelling-brand-emblem-wrap">
            <img src={handloomEmblem} alt="Handloom Connect emblem" className="storytelling-emblem" />
            <div className="storytelling-emblem-halo" />
          </div>
          <div className="storytelling-brand-meta">
            <span className="storytelling-eyebrow">Atelier & Heritage Archive</span>
            <span className="storytelling-brand-name">Handloom Connect</span>
          </div>
        </div>

        {/* Center Story Chapter Details */}
        <div className="storytelling-narrative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="storytelling-narrative-card"
            >
              <div className="storytelling-craft-badge">
                <span className="craft-badge-dot" />
                <span className="craft-badge-text">{current.craft}</span>
                <span className="craft-badge-sep">•</span>
                <span className="craft-badge-region">{current.region}</span>
              </div>

              <h2 className="storytelling-headline">
                Every Thread Tells a Story.
              </h2>

              <p className="storytelling-tagline">
                Connecting India&apos;s Handloom Heritage with the Future.
              </p>

              <blockquote className="storytelling-quote">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Statistics & Carousel Indicators */}
        <div className="storytelling-footer">
          {/* Authentic Impact Indicators */}
          <div className="storytelling-stats-row">
            <div className="storytelling-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Direct Living Wage</span>
            </div>
            <div className="storytelling-stat-divider" />
            <div className="storytelling-stat">
              <span className="stat-number">GI</span>
              <span className="stat-label">Certified Authentic</span>
            </div>
            <div className="storytelling-stat-divider" />
            <div className="storytelling-stat">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Years of Craft Heritage</span>
            </div>
          </div>

          {/* Chapter Selector Navigation */}
          <div className="storytelling-carousel-nav" role="tablist" aria-label="Heritage chapters">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                role="tab"
                aria-selected={idx === activeIdx}
                aria-label={`View chapter ${idx + 1}: ${ch.title}`}
                className={`storytelling-nav-pill ${idx === activeIdx ? 'is-active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="pill-bar" />
                <span className="pill-title">{ch.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
