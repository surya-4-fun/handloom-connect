import { Link } from 'react-router-dom'
import { Icon } from '../primitives/Icon'
import type { GroupedSearchResults, SearchResultItem } from '../../services/globalSearchService'

interface GlobalSearchResultsProps {
  results: GroupedSearchResults
  query: string
  activeIndex: number
  flatItems: SearchResultItem[]
  onSelect: (item: SearchResultItem) => void
  onHoverIndex: (index: number) => void
}

export function GlobalSearchResults({
  results,
  query,
  activeIndex,
  flatItems,
  onSelect,
  onHoverIndex
}: GlobalSearchResultsProps) {
  const { command, features, navigation, products, artisans, actions } = results
  const hasAnyResults = Boolean(command || features.length > 0 || navigation.length > 0 || products.length > 0 || artisans.length > 0 || actions.length > 0)

  if (!hasAnyResults) {
    return (
      <div className="global-search__empty">
        <div className="global-search__empty-icon">
          <Icon name="search" size={32} />
        </div>
        <p className="global-search__empty-title">No matching craft results found for &ldquo;{query}&rdquo;</p>
        <p className="global-search__empty-copy">
          Try searching for craft regions (e.g. <em>Varanasi, Kanchipuram, Kutch</em>), materials (<em>Silk, Tussar, Pashmina</em>), or features (<em>AI Assistant, AR Studio</em>).
        </p>
        <Link
          to={`/marketplace?search=${encodeURIComponent(query.trim())}`}
          className="global-search__empty-link"
          onClick={() => onSelect({ id: 'fallback-market', type: 'navigation', title: query, to: `/marketplace?search=${encodeURIComponent(query.trim())}` })}
        >
          Search entire marketplace for &ldquo;{query}&rdquo; →
        </Link>
      </div>
    )
  }

  return (
    <div className="global-search__results">
      {/* 1. Natural Language Filter Command */}
      {command && (
        <div className="global-search__group">
          <div className="global-search__group-header">
            <span>Filter Command</span>
          </div>
          {(() => {
            const idx = flatItems.findIndex(i => i.id === command.id)
            const isSelected = activeIndex === idx
            return (
              <div
                key={command.id}
                className={`global-search__item global-search__item--command ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelect(command)}
                onMouseEnter={() => onHoverIndex(idx)}
              >
                <div className="global-search__item-icon global-search__item-icon--command">
                  <Icon name={(command.icon as any) || 'sliders'} size={20} />
                </div>
                <div className="global-search__item-info">
                  <strong className="global-search__item-title">{command.title}</strong>
                  {command.subtitle && <span className="global-search__item-subtitle">{command.subtitle}</span>}
                </div>
                {command.badge && <span className="global-search__item-badge">{command.badge}</span>}
                <span className="global-search__item-arrow">↵</span>
              </div>
            )
          })()}
        </div>
      )}

      {/* 2. Products Section */}
      {products.length > 0 && (
        <div className="global-search__group">
          <div className="global-search__group-header">
            <span>Handloom Products ({products.length})</span>
            <Link
              to={`/marketplace?search=${encodeURIComponent(query.trim())}`}
              className="global-search__group-more"
              onClick={() => onSelect({ id: 'market-more', type: 'navigation', title: 'Marketplace', to: `/marketplace?search=${encodeURIComponent(query.trim())}` })}
            >
              View all in Marketplace →
            </Link>
          </div>
          <div className="global-search__product-list">
            {products.map(p => {
              const idx = flatItems.findIndex(i => i.id === p.id)
              const isSelected = activeIndex === idx
              return (
                <div
                  key={p.id}
                  className={`global-search__item global-search__item--product ${isSelected ? 'is-active' : ''}`}
                  onClick={() => onSelect(p)}
                  onMouseEnter={() => onHoverIndex(idx)}
                >
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="global-search__product-thumb" />
                  ) : (
                    <div className="global-search__item-icon">
                      <Icon name="shopping-bag" size={18} />
                    </div>
                  )}
                  <div className="global-search__item-info">
                    <strong className="global-search__item-title">{p.title}</strong>
                    {p.subtitle && <span className="global-search__item-subtitle">{p.subtitle}</span>}
                  </div>
                  {p.price !== undefined && (
                    <span className="global-search__product-price">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  {p.badge && <span className="global-search__item-badge">{p.badge}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. Features & Visual Capabilities */}
      {features.length > 0 && (
        <div className="global-search__group">
          <div className="global-search__group-header">
            <span>Platform Features</span>
          </div>
          {features.map(f => {
            const idx = flatItems.findIndex(i => i.id === f.id)
            const isSelected = activeIndex === idx
            return (
              <div
                key={f.id}
                className={`global-search__item global-search__item--feature ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelect(f)}
                onMouseEnter={() => onHoverIndex(idx)}
              >
                <div className="global-search__item-icon global-search__item-icon--feature">
                  <Icon name={(f.icon as any) || 'sparkles'} size={18} />
                </div>
                <div className="global-search__item-info">
                  <strong className="global-search__item-title">{f.title}</strong>
                  {f.subtitle && <span className="global-search__item-subtitle">{f.subtitle}</span>}
                </div>
                {f.badge && <span className="global-search__item-badge global-search__item-badge--gold">{f.badge}</span>}
                <span className="global-search__item-arrow">→</span>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. Master Artisans */}
      {artisans.length > 0 && (
        <div className="global-search__group">
          <div className="global-search__group-header">
            <span>Master Artisans & Guilds</span>
          </div>
          {artisans.map(a => {
            const idx = flatItems.findIndex(i => i.id === a.id)
            const isSelected = activeIndex === idx
            return (
              <div
                key={a.id}
                className={`global-search__item global-search__item--artisan ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelect(a)}
                onMouseEnter={() => onHoverIndex(idx)}
              >
                {a.image ? (
                  <img src={a.image} alt={a.title} className="global-search__artisan-avatar" />
                ) : (
                  <div className="global-search__item-icon">
                    <Icon name="user" size={18} />
                  </div>
                )}
                <div className="global-search__item-info">
                  <strong className="global-search__item-title">{a.title}</strong>
                  {a.subtitle && <span className="global-search__item-subtitle">{a.subtitle}</span>}
                </div>
                {a.badge && <span className="global-search__item-badge">{a.badge}</span>}
                <span className="global-search__item-arrow">→</span>
              </div>
            )
          })}
        </div>
      )}

      {/* 5. Navigation Pages */}
      {navigation.length > 0 && (
        <div className="global-search__group">
          <div className="global-search__group-header">
            <span>Navigation</span>
          </div>
          {navigation.map(n => {
            const idx = flatItems.findIndex(i => i.id === n.id)
            const isSelected = activeIndex === idx
            return (
              <div
                key={n.id}
                className={`global-search__item ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelect(n)}
                onMouseEnter={() => onHoverIndex(idx)}
              >
                <div className="global-search__item-icon">
                  <Icon name={(n.icon as any) || 'compass'} size={18} />
                </div>
                <div className="global-search__item-info">
                  <strong className="global-search__item-title">{n.title}</strong>
                  {n.subtitle && <span className="global-search__item-subtitle">{n.subtitle}</span>}
                </div>
                <span className="global-search__item-arrow">→</span>
              </div>
            )
          })}
        </div>
      )}

      {/* 6. User / Account Actions */}
      {actions.length > 0 && (
        <div className="global-search__group">
          <div className="global-search__group-header">
            <span>Account & Orders</span>
          </div>
          {actions.map(act => {
            const idx = flatItems.findIndex(i => i.id === act.id)
            const isSelected = activeIndex === idx
            return (
              <div
                key={act.id}
                className={`global-search__item ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelect(act)}
                onMouseEnter={() => onHoverIndex(idx)}
              >
                <div className="global-search__item-icon">
                  <Icon name={(act.icon as any) || 'user'} size={18} />
                </div>
                <div className="global-search__item-info">
                  <strong className="global-search__item-title">{act.title}</strong>
                  {act.subtitle && <span className="global-search__item-subtitle">{act.subtitle}</span>}
                </div>
                {act.badge && <span className="global-search__item-badge">{act.badge}</span>}
                <span className="global-search__item-arrow">→</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

