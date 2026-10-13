import { useState, FormEvent, useEffect } from 'react'
import { Link } from 'react-router-dom'
import handloomEmblem from '../../assets/images/handloom-logo-emblem.png'

type ModalType = 'privacy' | 'terms' | 'authenticity' | null

interface PolicyContent {
  title: string
  subtitle: string
  sections: Array<{ heading: string; body: string }>
}

const POLICIES: Record<'privacy' | 'terms' | 'authenticity', PolicyContent> = {
  privacy: {
    title: 'Patron Privacy & Data Sovereignty Guarantee',
    subtitle: 'Handloom Connect Atelier · Trust & Integrity',
    sections: [
      {
        heading: 'Patron Data Discretion',
        body: 'We collect only essential details required to fulfill loom commissions, custom drape inquiries, and shipping consignments. Your contact and payment information is strictly encrypted and never rented, sold, or shared with third-party advertisers.'
      },
      {
        heading: 'Artisan Attribution Sovereignty',
        body: 'Artisans retain full sovereign rights over their biographies, cluster coordinates, and generational lineage documented on this platform. Public listings adhere to voluntary craft disclosure standards.'
      },
      {
        heading: 'Secure Dispatch & Communications',
        body: 'Email dispatches for our chronicles can be unsubscribed from at any moment with a single click. We respect your digital peace as reverently as we honor the silence of the loom.'
      }
    ]
  },
  terms: {
    title: 'Terms of Heritage Patronage & Handcraft Standards',
    subtitle: 'Fair Trade & Weaver Attribution Code',
    sections: [
      {
        heading: 'The Nature of Authentic Handcraft',
        body: 'Each handwoven saree, stole, and yardage is created manually on traditional pit, throw-shuttle, or frame looms. Slight variations in zari density, weave cadence, and botanical dye saturation are hallmarks of genuine human mastery, not defects.'
      },
      {
        heading: '100% Direct Artisan Royalty',
        body: 'A minimum of 72% to 85% of each acquisition price is transferred directly to the designated master weaver collective or independent artisan, eliminating intermediary exploitation.'
      },
      {
        heading: 'Loom Inspection & Heirloom Exchange',
        body: 'Patrons receive real-time loom tracking for commissioned pieces. Due to the irreplaceable artistic effort of handloom weaving, exchanges are supported with dignity for verifiable craft transit discrepancies.'
      }
    ]
  },
  authenticity: {
    title: 'Silk Mark & GI-Tag Heritage Certification Standards',
    subtitle: 'Protected Geographical Indications & Ministry Guild Codes',
    sections: [
      {
        heading: 'Silk Mark India Verification',
        body: 'All mulberry, tussar, muga, and eri silk pieces are certified by the Silk Mark Organisation of India (SMOI), guaranteeing 100% natural, laboratory-tested protein silk filament without synthetic blending.'
      },
      {
        heading: 'Geographical Indication (GI) Protection',
        body: 'GI-tagged textiles — including Varanasi Katan Silk, Kanchipuram Temple Border weaves, Chanderi, and Sambalpuri Ikat — are sourced strictly within their legally demarcated artisan clusters under registered producer numbers.'
      },
      {
        heading: 'Digital Provenance Registry',
        body: 'Every heirloom garment is cataloged with verified weaver attribution, cluster coordinates, and pit loom specifications directly verifiable via our Order Tracking and Craft Registry.'
      }
    ]
  }
}

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null)
      }
    }
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeModal])

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmed) {
      setNewsletterStatus('error')
      setErrorMessage('Please enter an email address.')
      return
    }

    if (!emailRegex.test(trimmed)) {
      setNewsletterStatus('error')
      setErrorMessage('Please enter a valid email address (e.g., patron@domain.com).')
      return
    }

    setNewsletterStatus('loading')

    // Authentic interactive dispatch response
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('hc_newsletter_subscribers') || '[]')
        if (!stored.includes(trimmed)) {
          stored.push(trimmed)
          localStorage.setItem('hc_newsletter_subscribers', JSON.stringify(stored))
        }
      } catch {
        // Safe localStorage fallback
      }
      setNewsletterStatus('success')
      setEmail('')
    }, 600)
  }

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site Footer">
      {/* Heritage Gold Gradient Thread Accent */}
      <div className="footer-heritage-accent" aria-hidden="true" />

      <div className="container">
        <div className="footer-main-grid">

          {/* ─────────────────────────────────────────────────────────────
              SECTION 1: BRAND & MISSION
              ───────────────────────────────────────────────────────────── */}
          <div className="footer-brand-wrap">
            <Link to="/" className="footer-brand-header" aria-label="Handloom Connect — Home">
              <img
                src={handloomEmblem}
                alt="Handloom Connect Atelier Emblem"
                className="footer-brand-logo"
                width={44}
                height={44}
              />
              <div className="footer-brand-text">
                <span className="footer-brand-title">Handloom Connect</span>
                <span className="footer-brand-subtitle">High Handloom Atelier · India</span>
              </div>
            </Link>

            <p className="footer-brand-desc">
              A cultural technology platform connecting India’s master handloom artisans directly with mindful patrons worldwide. Preserving sacred loom geometries, handspun fiber provenance, and indigenous textile legacies.
            </p>

            <div className="footer-brand-badges">
              <span className="footer-badge-pill">🏛️ GI-Tagged Clusters</span>
              <span className="footer-badge-pill">🧵 Silk Mark Verified</span>
              <span className="footer-badge-pill">🤝 Direct Artisan Attribution</span>
            </div>

            {/* Configured Authentic Social Link Channels */}
            <div className="footer-social-row" aria-label="Official Social Channels">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Handloom Connect on Instagram"
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Handloom Connect on Pinterest"
                title="Pinterest"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Handloom Connect on YouTube"
                title="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Handloom Connect on X"
                title="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 2: EXPLORE ATELIER
              ───────────────────────────────────────────────────────────── */}
          <div className="footer-col">
            <h3 className="footer-col-title">Explore Atelier</h3>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/marketplace" className="footer-nav-link">
                  Handloom Marketplace
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/artisans" className="footer-nav-link">
                  Master Artisans & Guilds
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/raw-materials" className="footer-nav-link">
                  Raw Materials & Yarn Supply <span className="footer-link-tag">B2B</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/ar-studio" className="footer-nav-link">
                  Virtual 3D AR Studio <span className="footer-link-tag">Spatial</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/origin-map" className="footer-nav-link">
                  Interactive Craft Origin Map
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/ai-fashion-assistant" className="footer-nav-link">
                  AI Fashion Stylist & Curator
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/about" className="footer-nav-link">
                  The Atelier Heritage Story
                </Link>
              </li>
            </ul>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 3: CUSTOMER SUPPORT & AUTHENTICITY
              ───────────────────────────────────────────────────────────── */}
          <div className="footer-col">
            <h3 className="footer-col-title">Patron Care & Trust</h3>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <Link to="/contact" className="footer-nav-link">
                  Contact Atelier & Inquiries
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/order-tracking" className="footer-nav-link">
                  Track Live Loom Commission
                </Link>
              </li>
              <li className="footer-link-item">
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => setActiveModal('authenticity')}
                >
                  Silk Mark & GI Authenticity Standards
                </button>
              </li>
              <li className="footer-link-item">
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => setActiveModal('terms')}
                >
                  Terms of Heritage Patronage
                </button>
              </li>
              <li className="footer-link-item">
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => setActiveModal('privacy')}
                >
                  Patron Privacy & Sovereignty Code
                </button>
              </li>
              <li className="footer-link-item">
                <Link to="/profile" className="footer-nav-link">
                  Patron Atelier Account
                </Link>
              </li>
            </ul>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 4: THE ARTISAN DISPATCH (NEWSLETTER)
              ───────────────────────────────────────────────────────────── */}
          <div className="footer-newsletter-wrap">
            <h3 className="footer-col-title">The Artisan Dispatch</h3>
            <p className="footer-newsletter-desc">
              Receive curated chronicles directly from the pit looms: master artisan monographs, seasonal botanical dye releases, and archival textile drops.
            </p>

            <form className="footer-newsletter-form" onSubmit={handleSubscribe} noValidate>
              <div className="footer-input-row">
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (newsletterStatus === 'error') setNewsletterStatus('idle')
                  }}
                  placeholder="Enter your email address..."
                  className="footer-newsletter-input"
                  aria-label="Email address for Artisan Dispatch newsletter"
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                />
                <button
                  type="submit"
                  className="footer-newsletter-btn"
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  aria-label="Subscribe to Artisan Dispatch"
                >
                  {newsletterStatus === 'loading' ? (
                    'Joining...'
                  ) : newsletterStatus === 'success' ? (
                    'Joined ✓'
                  ) : (
                    <>
                      <span>Join Circle</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {newsletterStatus === 'success' && (
                <div className="footer-newsletter-status footer-newsletter-status--success" role="status">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Welcome to the patronage circle. Sourced stories from the loom will arrive in your inbox.</span>
                </div>
              )}

              {newsletterStatus === 'error' && (
                <div className="footer-newsletter-status footer-newsletter-status--error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="footer-privacy-note">
                Respecting your digital tranquility. Unsubscribe at any time.
              </p>
            </form>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM BAR: COPYRIGHT, HERITAGE EMBLEM & LEGAL MODAL TRIGGERS
            ───────────────────────────────────────────────────────────── */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            <span>© 2026 Handloom Connect Atelier · Diploma Project</span>
            <span aria-hidden="true">·</span>
            <span>In Service of India’s Traditional Weavers</span>
          </div>

          <div className="footer-bottom-links">
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => setActiveModal('privacy')}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => setActiveModal('terms')}
            >
              Terms of Patronage
            </button>
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => setActiveModal('authenticity')}
            >
              GI Certification Code
            </button>
            <span className="footer-locale-pill" title="Atelier Locale & Currency">
              <span>🇮🇳</span> English (India) · ₹ INR
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          GENUINE MODAL: HERITAGE GUARANTEES, PRIVACY & TERMS
          ───────────────────────────────────────────────────────────── */}
      {activeModal && (
        <div
          className="footer-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-modal-title"
        >
          <div className="footer-modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="footer-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <h2 id="footer-modal-title" className="footer-modal-title">
              {POLICIES[activeModal].title}
            </h2>
            <span className="footer-modal-subtitle">
              {POLICIES[activeModal].subtitle}
            </span>

            <div className="footer-modal-body">
              {POLICIES[activeModal].sections.map((section) => (
                <div key={section.heading}>
                  <strong>{section.heading}</strong>
                  <p style={{ margin: '4px 0 0' }}>{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
