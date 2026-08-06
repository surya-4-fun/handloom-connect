import { Link } from 'react-router-dom'

const footerGroups = [
  { title: 'Shop', links: [['Handloom Marketplace', '/marketplace'], ['Raw materials', '/materials'], ['Virtual AR Studio', '/ar-studio'], ['Gift guide', '/marketplace']] },
  { title: 'Discover', links: [['Artisan stories', '/artisans'], ['Interactive Craft Map', '/origin-map'], ['Craft journal', '/about'], ['AI stylist', '/ai-fashion-assistant']] },
  { title: 'Support', links: [['Track Loom Order', '/order-tracking'], ['Delivery & returns', '/contact'], ['Care guide', '/ai-material-guide'], ['Accessibility', '/about']] },
]

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-intro"><div className="brand brand--footer"><span className="brand-mark">HC</span><span className="brand-copy"><strong>Handloom</strong><small>Connect</small></span></div><p>A cultural technology platform connecting India’s makers with thoughtful homes.</p><form className="newsletter" onSubmit={e => e.preventDefault()}><label htmlFor="email">Stories from the loom</label><div><input id="email" type="email" placeholder="Email address"/><button type="submit" aria-label="Subscribe">→</button></div></form></div>{footerGroups.map(group => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}</div>)}</div><div className="container footer-base"><span>© 2026 Handloom Connect · Diploma project</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><button>English (India)</button></div></div></footer>
}
