import type { ShopCategory } from '../../types/shopTypes'

interface CategoryNavProps {
  categories: ShopCategory[]
  activeCategory: string
  onSelect: (categoryId: string) => void
}

export function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  const isAll = !activeCategory || activeCategory === 'all'

  return (
    <nav className="category-nav" aria-label="Product categories">
      <div className="container">
        <div className="category-nav__list" role="tablist">
          <button
            role="tab"
            aria-selected={isAll}
            className={`category-chip ${isAll ? 'category-chip--active' : ''}`}
            onClick={() => onSelect('all')}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'category-chip--active' : ''}`}
              onClick={() => onSelect(cat.id)}
            >
              {cat.label}
              {cat.count > 0 && <span className="category-chip__count">({cat.count})</span>}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
