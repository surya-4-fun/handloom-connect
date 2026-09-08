import { useState } from 'react'
import { Icon } from '../primitives/Icon'
import type { ShopFilters, SortOption } from '../../types/shopTypes'
import { SORT_LABELS } from '../../types/shopTypes'
import type { ProductFacets } from '../../services/productService'

export interface ShopFiltersProps {
  filters: ShopFilters
  updateFilter: <K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => void
  toggleArrayFilter: <K extends 'materials' | 'regions' | 'techniques' | 'artisanIds'>(key: K, value: string) => void
  resetFilters: () => void
  activeFilterCount: number
  facets?: ProductFacets
  isLoadingFacets?: boolean
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="filter-option" onClick={onChange}>
      <span className={`filter-checkbox ${checked ? 'filter-checkbox--checked' : ''}`}>
        {checked && <Icon name="check" size={11} />}
      </span>
      {label}
    </label>
  )
}

function FilterPanel({ filters, updateFilter, toggleArrayFilter, resetFilters, activeFilterCount, facets, isLoadingFacets }: ShopFiltersProps) {
  const materials = facets?.materials || []
  const regions = facets?.regions || []
  const techniques = facets?.techniques || []

  return (
    <>
      <div className="shop-filters__header">
        <span className="shop-filters__title">
          <Icon name="filter" size={16} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
        {activeFilterCount > 0 && (
          <button className="shop-filters__reset" onClick={resetFilters}>
            Clear all
          </button>
        )}
      </div>

      <div className="filter-group">
        <span className="filter-group__label">Material</span>
        {isLoadingFacets && materials.length === 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Loading materials...</span>
        )}
        {!isLoadingFacets && materials.length === 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>No materials available</span>
        )}
        {materials.slice(0, 10).map(mat => (
          <FilterCheckbox
            key={mat}
            label={mat}
            checked={filters.materials.includes(mat)}
            onChange={() => toggleArrayFilter('materials', mat)}
          />
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-group__label">Region</span>
        {isLoadingFacets && regions.length === 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Loading regions...</span>
        )}
        {!isLoadingFacets && regions.length === 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>No regions available</span>
        )}
        {regions.slice(0, 10).map(reg => (
          <FilterCheckbox
            key={reg}
            label={reg}
            checked={filters.regions.includes(reg)}
            onChange={() => toggleArrayFilter('regions', reg)}
          />
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-group__label">Technique</span>
        {isLoadingFacets && techniques.length === 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Loading techniques...</span>
        )}
        {!isLoadingFacets && techniques.length === 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>No techniques available</span>
        )}
        {techniques.slice(0, 10).map(tech => (
          <FilterCheckbox
            key={tech}
            label={tech}
            checked={filters.techniques.includes(tech)}
            onChange={() => toggleArrayFilter('techniques', tech)}
          />
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-group__label">Availability</span>
        <FilterCheckbox
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => updateFilter('inStockOnly', !filters.inStockOnly)}
        />
      </div>
    </>
  )
}

export function ShopFiltersSidebar(props: ShopFiltersProps) {
  return (
    <aside className="shop-filters shop-filters--desktop" aria-label="Filter products">
      <FilterPanel {...props} />
    </aside>
  )
}

export function MobileFilterButton({ activeFilterCount, onClick }: { activeFilterCount: number; onClick: () => void }) {
  return (
    <button className="mobile-filter-btn" onClick={onClick} aria-label="Open filters">
      <Icon name="filter" size={16} />
      Filters
      {activeFilterCount > 0 && <span className="mobile-filter-badge">{activeFilterCount}</span>}
    </button>
  )
}

export function MobileFilterDrawer({ isOpen, onClose, ...props }: ShopFiltersProps & { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <>
      <div className="filter-drawer-backdrop" onClick={onClose} />
      <div className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filter products">
        <div className="filter-drawer__header">
          <span className="shop-filters__title">
            <Icon name="filter" size={16} />
            Filters
          </span>
          <button className="filter-drawer__close" onClick={onClose} aria-label="Close filters">
            <Icon name="close" size={16} />
          </button>
        </div>
        <FilterPanel {...props} />
        <div style={{ marginTop: '24px' }}>
          <button className="button button--primary" style={{ width: '100%' }} onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

export function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false)
  const options = Object.entries(SORT_LABELS) as [SortOption, string][]

  return (
    <div className="shop-sort">
      <button className="shop-sort__btn" onClick={() => setOpen(v => !v)} aria-label="Sort products">
        <Icon name="sort" size={15} />
        {SORT_LABELS[value]}
        <Icon name="chevron-down" size={14} />
      </button>
      {open && (
        <div className="shop-sort__dropdown">
          {options.map(([key, label]) => (
            <button
              key={key}
              className={`shop-sort__option ${value === key ? 'shop-sort__option--active' : ''}`}
              onClick={() => { onChange(key); setOpen(false) }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
