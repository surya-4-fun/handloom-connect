import { Icon } from '../primitives/Icon'

interface ShopHeroProps {
  searchValue: string
  onSearchChange: (value: string) => void
  totalProducts: number
}

export function ShopHero({ searchValue, onSearchChange, totalProducts }: ShopHeroProps) {
  return (
    <section className="shop-hero" aria-label="Shop introduction">
      <div className="shop-hero__bg" aria-hidden="true" />
      <div className="container shop-hero__inner">
        <p className="eyebrow" style={{ justifyContent: 'center' }}>Curated Collection</p>
        <h1 className="shop-hero__title">
          Shop Handcrafted Heritage
        </h1>
        <p className="shop-hero__subtitle">
          Authentic handloom textiles traced to the loom and artisan who created them.
          {totalProducts > 0 && <> Explore {totalProducts} handcrafted pieces.</>}
        </p>
        <div className="shop-search">
          <Icon name="search" size={18} className="shop-search__icon" />
          <input
            type="search"
            className="shop-search__input"
            placeholder="Search by craft, material, region, or artisan…"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
          {searchValue && (
            <button
              className="shop-search__clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
