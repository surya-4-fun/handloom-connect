import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon } from '../primitives/Icon'
import { ButtonLink } from '../primitives/Button'

const groups = [
  { title: 'By product', links: ['Sarees', 'Stoles & Dupattas', 'Home Textiles', 'Apparel'] },
  { title: 'By craft', links: ['Chanderi', 'Ikat', 'Kanchipuram', 'Banarasi'] },
  { title: 'By story', links: ['Meet the makers', 'Natural dyes', 'New heirlooms', 'Craft journal'] },
]

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' }
]

function UtilityLink({ to, label, icon, count }: { to: string; label: string; icon: 'heart' | 'bag' | 'user'; count?: number }) {
  return <Link to={to} className="icon-button" aria-label={label}><Icon name={icon}/>{count !== undefined && <span className="utility-count">{count}</span>}</Link>
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('hc-theme') === 'dark')
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setMegaOpen(false); setSearchOpen(false) }, [location.pathname])
  
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('hc-theme', dark ? 'dark' : 'light')
  }, [dark])
  
  useEffect(() => { if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 60) }, [searchOpen])

  // Track active section when on home page
  useEffect(() => {
    if (location.pathname !== '/') return

    if (location.hash) {
      const hashId = location.hash.replace('#', '')
      if (sections.some(s => s.id === hashId)) {
        setActiveSection(hashId)
      }
    }

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2
      let activeSec = 'home'

      for (const sec of sections) {
        const el = document.getElementById(sec.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            activeSec = sec.id
            break
          }
        }
      }

      setActiveSection(activeSec)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname, location.hash])

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    setActiveSection(sectionId)
    if (location.pathname === '/') {
      e.preventDefault()
      const el = document.getElementById(sectionId)
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 85
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  const isHome = location.pathname === '/'
  return (
    <header className={`site-header ${(scrolled || !isHome) ? 'site-header--solid' : ''}`}>
      <div className="announcement"><span>Direct from verified makers</span><i aria-hidden="true"/><span>Complimentary delivery above ₹2,500</span></div>
      <div className="nav-shell">
        <Link to="/" className="brand" aria-label="Handloom Connect home"><span className="brand-mark" aria-hidden="true">HC</span><span className="brand-copy"><strong>Handloom</strong><small>Connect</small></span></Link>
        <nav className="desktop-nav" aria-label="Primary">
          <button className={`nav-link nav-link--button ${location.pathname === '/marketplace' ? 'active' : ''}`} aria-expanded={megaOpen} onClick={() => setMegaOpen(v => !v)}>Shop <span aria-hidden="true">⌄</span></button>
          
          {sections.map(sec => {
            const isActive = isHome && activeSection === sec.id
            return (
              <Link 
                key={sec.id}
                to={`/#${sec.id}`}
                onClick={(e) => handleNavClick(e, sec.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {sec.label}
              </Link>
            )
          })}

          <NavLink to="/materials" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Materials</NavLink>
          <NavLink to="/origin-map" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Craft Map</NavLink>
          <NavLink to="/ar-studio" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>AR Studio</NavLink>
          <NavLink to="/order-tracking" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Track Order</NavLink>
          <NavLink to="/ai-fashion-assistant" className={({ isActive }) => `nav-link nav-link--ai ${isActive ? 'active' : ''}`}><Icon name="sparkles" size={15}/> AI Assistant</NavLink>
        </nav>
        <div className="nav-utilities">
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}><Icon name="search"/></button>
          <UtilityLink to="/wishlist" label="Wishlist" icon="heart"/>
          <UtilityLink to="/cart" label="Cart, 2 items" icon="bag" count={2}/>
          <UtilityLink to="/account" label="Account" icon="user"/>
          <button className="icon-button theme-toggle" aria-label={`Use ${dark ? 'light' : 'dark'} theme`} onClick={() => setDark(v => !v)}><Icon name={dark ? 'sun' : 'moon'}/></button>
          <button className="icon-button mobile-menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Icon name="menu"/></button>
        </div>
      </div>

      {megaOpen && <div className="mega-menu">
        <div className="mega-menu__inner">
          {groups.map(group => <div key={group.title}><p>{group.title}</p>{group.links.map(link => <Link key={link} to="/marketplace">{link}</Link>)}</div>)}
          <div className="mega-feature"><span>THE EDIT</span><strong>Monsoon Indigo</strong><p>Deep colour. Quiet craft. Pieces made to live with.</p><ButtonLink to="/marketplace" variant="secondary">Explore the edit</ButtonLink></div>
        </div>
      </div>}

      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search Handloom Connect">
        <button className="icon-button search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><Icon name="close"/></button>
        <div className="search-panel"><p className="eyebrow">Discover by craft, maker or place</p><label className="search-field"><Icon name="search" size={28}/><input ref={searchRef} placeholder="Try “indigo ikat”" aria-label="Search products"/></label><div className="search-suggestions"><span>Popular now</span>{['Chanderi sarees', 'Natural dyes', 'Gifts under ₹3,000', 'Kutch weaving'].map(x => <Link key={x} to="/marketplace">{x}</Link>)}</div></div>
      </div>}

      <div className={`mobile-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer__top"><span className="brand-copy"><strong>Handloom</strong><small>Connect</small></span><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icon name="close"/></button></div>
        <nav aria-label="Mobile">
          {sections.map(sec => (
            <Link 
              key={sec.id} 
              to={`/#${sec.id}`} 
              onClick={(e) => { handleNavClick(e, sec.id); setMenuOpen(false); }}
            >
              {sec.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '15px 0' }} />
          <NavLink to="/marketplace">Shop the collection</NavLink>
          <NavLink to="/materials">Raw materials</NavLink>
          <NavLink to="/ai-fashion-assistant">AI Fashion Assistant</NavLink>
          <NavLink to="/ai-material-guide">AI Material Guide</NavLink>
        </nav>
        <div className="mobile-drawer__footer"><Link to="/account">Sign in</Link><Link to="/contact">Contact</Link></div>
      </div>
      {menuOpen && <button className="drawer-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)}/>} 
    </header>
  )
}

