import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Storytelling3DCanvas } from '../components/about/Storytelling3DCanvas'
import '../styles/storytelling-about.css'

interface SceneChapter {
  id: string
  num: string
  label: string
}

const CHAPTERS: SceneChapter[] = [
  { id: 'scene-beginning', num: '01', label: 'The Genesis' },
  { id: 'scene-thread', num: '02', label: 'The Thread' },
  { id: 'scene-weaving', num: '03', label: 'The Weaving' },
  { id: 'scene-artisans', num: '04', label: 'The Artisans' },
  { id: 'scene-connection', num: '05', label: 'The Connection' },
  { id: 'scene-future', num: '06', label: 'The Future' },
]

export function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0)
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false)

  // 1. Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // 2. High-performance scroll tracking for 3D synchronization
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1)
      setScrollProgress(progress)

      // Determine active chapter (6 segments: ~0.166 each)
      const chapterIdx = Math.min(Math.floor(progress * CHAPTERS.length), CHAPTERS.length - 1)
      setActiveChapterIndex(chapterIdx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToChapter = (index: number) => {
    const chapterId = CHAPTERS[index].id
    const element = document.getElementById(chapterId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div ref={containerRef} className="story-container">
      {/* Real-time 3D Storytelling WebGL Canvas */}
      <Storytelling3DCanvas
        scrollProgress={scrollProgress}
        isReducedMotion={isReducedMotion}
      />

      {/* Atmospheric Overlays */}
      <div className="story-noise-overlay" />
      <div className="story-vignette" />

      {/* Top Scroll Progress Line */}
      <div
        className="story-progress-bar"
        style={{ width: `${Math.round(scrollProgress * 100)}%` }}
      />

      {/* Right HUD Chapter Dot Tracker */}
      <nav className="story-hud-tracker" aria-label="Narrative Chapters">
        {CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            type="button"
            className={`story-hud-dot ${activeChapterIndex === idx ? 'active' : ''}`}
            data-label={`${ch.num} · ${ch.label}`}
            onClick={() => scrollToChapter(idx)}
            aria-label={`Jump to Scene ${ch.num}: ${ch.label}`}
          />
        ))}
      </nav>

      {/* ===================================================================
          SCENE 1: THE BEGINNING — THE GENESIS
          =================================================================== */}
      <section id="scene-beginning" className="story-scene story-scene-pinned" style={{ minHeight: '100vh' }}>
        <div className="story-content-wrap" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="story-eyebrow">
              Scene 01 / 06 · An Immersive Chronicle
            </span>
            <h1 className="story-title" style={{ maxWidth: '980px', margin: '0 auto 1.8rem' }}>
              Every Thread Tells <em>a Story.</em>
            </h1>
            <p className="story-desc" style={{ margin: '0 auto 2.5rem', maxWidth: '620px' }}>
              Step into the living heritage of Indian handloom. Where sacred geometry, raw filament silk, and generations of master weavers converge into a modern digital renaissance.
            </p>
          </motion.div>
        </div>

        {/* Scroll Callout */}
        <div className="story-scroll-hint">
          <div className="story-scroll-mouse" />
          <span>Scroll to Unwind the Thread</span>
        </div>
      </section>

      {/* ===================================================================
          SCENE 2: THE THREAD — FROM COCOON TO SPOOL
          =================================================================== */}
      <section id="scene-thread" className="story-scene">
        <div className="story-content-wrap">
          <div style={{ maxWidth: '640px' }}>
            <span className="story-eyebrow">
              Scene 02 / 06 · Material Provenance
            </span>
            <h2 className="story-title">
              The Soul of the <em>Fiber.</em>
            </h2>
            <p className="story-desc">
              Long before the wooden shuttle rattles across the loom, there is only the solitary filament: wild Tussar silk harvested from deciduous sal forests, pure mulberry filaments, and handspun Khadi cotton.
            </p>
            <div className="story-card" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🧵</span>
                <strong style={{ color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  The Microscopic Canvas
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#c4bbb0', lineHeight: 1.65 }}>
                A single heirloom Banarasi saree requires over <strong>forty thousand meters</strong> of continuous, unbroken zari and silk yarn. Each thread possesses tensile memory, tensioned by hand across the warp beam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SCENE 3: THE WEAVING — THE HARMONY OF THE PIT LOOM
          =================================================================== */}
      <section id="scene-weaving" className="story-scene">
        <div className="story-content-wrap" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: '640px' }}>
            <span className="story-eyebrow">
              Scene 03 / 06 · The Rhythmic Loom
            </span>
            <h2 className="story-title">
              Interlacing Warp <em>&amp; Weft.</em>
            </h2>
            <p className="story-desc">
              Beneath the earth-carved pit of a traditional Indian loom, wooden treadles descend and lift. The shuttle flies across the shed, marrying the longitudinal warp threads with the crosswise weft in an unbroken cadence.
            </p>
            <div className="story-card" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>⚙️</span>
                <strong style={{ color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  Sacred Binary Mathematics
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#c4bbb0', lineHeight: 1.65 }}>
                Centuries before binary computing, Jacquard and Naksha harness cords coded complex mythological brocades into punched paper cards—converting oral folklore into tactile woven poetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SCENE 4: THE ARTISANS — GUARDIANS OF CULTURAL MEMORY
          =================================================================== */}
      <section id="scene-artisans" className="story-scene">
        <div className="story-content-wrap">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span className="story-eyebrow" style={{ justifyContent: 'center' }}>
              Scene 04 / 06 · Human Mastery
            </span>
            <h2 className="story-title">
              Hands That Preserve <em>Generations.</em>
            </h2>
            <p className="story-desc" style={{ margin: '0 auto' }}>
              Across Varanasi, Kanchipuram, Phulia, and Kashmir, master weavers pass instinctive tension, color calibration, and motifs from parent to child. Meet the living custodians of this craft.
            </p>
          </div>

          {/* Genuine Project Artisan Showcase */}
          <div className="story-artisan-grid">
            <div className="story-artisan-item">
              <img
                src="/images/artisans/rajeshwar-ansari.jpg"
                alt="Master Weaver Rajeshwar Ansari at Varanasi pit loom"
                loading="lazy"
              />
              <div className="story-artisan-caption">
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Varanasi, Uttar Pradesh
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px', fontFamily: 'var(--font-display)' }}>
                  Rajeshwar Ansari
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#a89f91', margin: 0 }}>
                  4th Generation Master of Katan Silk &amp; Real Silver Zari
                </p>
              </div>
            </div>

            <div className="story-artisan-item">
              <img
                src="/images/artisans/ghulam-rasool.jpg"
                alt="Master Pashmina artisan Ghulam Rasool"
                loading="lazy"
              />
              <div className="story-artisan-caption">
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Srinagar, Kashmir
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px', fontFamily: 'var(--font-display)' }}>
                  Ghulam Rasool
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#a89f91', margin: 0 }}>
                  Pashmina Spinner &amp; Needle Sozni Artisan
                </p>
              </div>
            </div>

            <div className="story-artisan-item">
              <img
                src="/images/artisans/hero-artisan.jpg"
                alt="Master Weaver at traditional wooden loom"
                loading="lazy"
              />
              <div className="story-artisan-caption">
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Kanchipuram, Tamil Nadu
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px', fontFamily: 'var(--font-display)' }}>
                  Saraswathi Guild
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#a89f91', margin: 0 }}>
                  Interlocked Korvai Temple Border Weavers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SCENE 5: THE CONNECTION — TRIADIC PLATFORM ECOSYSTEM
          =================================================================== */}
      <section id="scene-connection" className="story-scene">
        <div className="story-content-wrap">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
            <span className="story-eyebrow" style={{ justifyContent: 'center' }}>
              Scene 05 / 06 · The Digital Bridge
            </span>
            <h2 className="story-title">
              Connecting the <em>Three Pillars.</em>
            </h2>
            <p className="story-desc" style={{ margin: '0 auto' }}>
              Handloom Connect eliminates exploitative intermediaries by forging direct, authenticated links between weavers, conscious patrons, and raw material suppliers.
            </p>
          </div>

          <div className="story-triad-grid">
            <div className="story-triad-box">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🧑‍🎨</div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>
                1. Master Artisans
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#c4bbb0', lineHeight: 1.6, margin: 0 }}>
                Direct digital storefronts, authentic artisan profiles, and fair remuneration without predatory middlemen margins.
              </p>
            </div>

            <div className="story-triad-box">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>✨</div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>
                2. Conscious Patrons
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#c4bbb0', lineHeight: 1.6, margin: 0 }}>
                Verified geographical provenance, 360° product traceability, AR Studio spatial drape preview, and cultural AI styling guidance.
              </p>
            </div>

            <div className="story-triad-box">
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🌿</div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>
                3. Raw Material Suppliers
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#c4bbb0', lineHeight: 1.6, margin: 0 }}>
                A dedicated B2B sourcing portal connecting silk rearers, organic cotton growers, and natural indigo vats directly to rural weaver clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SCENE 6: THE FUTURE — THE FINISHED HEIRLOOM & CALLS TO ACTION
          =================================================================== */}
      <section id="scene-future" className="story-scene" style={{ minHeight: '100vh', paddingBottom: '140px' }}>
        <div className="story-content-wrap" style={{ textAlign: 'center' }}>
          <div className="story-card" style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(40px, 6vw, 70px)' }}>
            <span className="story-eyebrow" style={{ justifyContent: 'center' }}>
              Scene 06 / 06 · The Digital Renaissance
            </span>
            <h2 className="story-title" style={{ margin: '0 auto 1.5rem' }}>
              Weaving the <em>Next Century.</em>
            </h2>
            <p className="story-desc" style={{ margin: '0 auto 2.5rem', maxWidth: '640px' }}>
              By merging centuries of master hand craftsmanship with cutting-edge web technology, we ensure that the rhythmic sound of the Indian handloom echoes into tomorrow.
            </p>

            {/* Functional Calls to Action with Verified Routes */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/marketplace"
                className="button button--primary button--gold-glow"
                style={{ padding: '16px 32px', fontSize: '0.9rem', textDecoration: 'none' }}
              >
                Explore Marketplace →
              </Link>
              <Link
                to="/artisans"
                className="button button--secondary"
                style={{ padding: '16px 28px', fontSize: '0.9rem', textDecoration: 'none' }}
              >
                Discover Artisans
              </Link>
              <Link
                to="/raw-materials"
                className="button button--ghost"
                style={{ padding: '16px 28px', fontSize: '0.9rem', textDecoration: 'none' }}
              >
                Raw Materials Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
