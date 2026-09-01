import { Link } from 'react-router-dom'
import { ContactSection } from '../components/sections/ContactSection'

export function ContactPage() {
  return (
    <div className="contact-page" style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--canvas)', color: 'var(--ink)' }}>
      <div className="container" style={{ marginBottom: '24px' }}>
        <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--muted)', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Contact</span>
        </nav>
      </div>

      <ContactSection />
    </div>
  )
}
