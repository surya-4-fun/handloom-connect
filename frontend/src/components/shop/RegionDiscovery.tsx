import { SHOP_REGIONS } from '../../utils/mocks/shopData'

interface RegionDiscoveryProps {
  onSelectRegion: (regionName: string) => void
}

export function RegionDiscovery({ onSelectRegion }: RegionDiscoveryProps) {
  return (
    <section className="region-discovery" aria-label="Discover by region">
      <div className="container">
        <div className="region-discovery__header">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Cultural Provenance</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--ink)' }}>
            Discover by Craft Clusters
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '560px', marginInline: 'auto' }}>
            Explore authentic handloom traditions rooted in India's iconic weaving regions.
          </p>
        </div>

        <div className="region-discovery__grid">
          {SHOP_REGIONS.map(region => (
            <div
              key={region.id}
              className="region-card"
              onClick={() => onSelectRegion(region.name)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelectRegion(region.name) }}
            >
              <img src={region.image} alt={`${region.name}, ${region.state}`} className="region-card__image" loading="lazy" />
              <div className="region-card__overlay" />
              <div className="region-card__content">
                <span className="region-card__state">{region.state}</span>
                <h3 className="region-card__name">{region.name}</h3>
                <div className="region-card__crafts">
                  {region.crafts.map(c => (
                    <span key={c} className="region-card__craft-tag">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
