import { Link } from 'react-router-dom'
import type { ShopArtisan } from '../../types/shopTypes'

interface ArtisanStripProps {
  artisan: ShopArtisan
}

export function ArtisanStrip({ artisan }: ArtisanStripProps) {
  return (
    <div className="artisan-strip">
      <img src={artisan.image} alt={artisan.name} className="artisan-strip__avatar" />
      <div className="artisan-strip__info">
        <h4 className="artisan-strip__name">{artisan.name}</h4>
        <span className="artisan-strip__craft">
          {artisan.craft} · {artisan.region} ({artisan.experience})
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to={`/artisan-story/${artisan.id}`} className="artisan-strip__link" style={{ color: 'var(--gold)', fontWeight: 600 }}>
          Story Lens →
        </Link>
        <Link to={`/artisans/${artisan.id}`} className="artisan-strip__link">
          Meet the Artisan →
        </Link>
      </div>
    </div>
  )
}
