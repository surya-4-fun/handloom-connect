import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { FormEvent, KeyboardEvent, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../primitives/Icon'
import { useAuth } from '../../context/AuthContext'
import {
  executeGlobalSearch,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  type GroupedSearchResults,
  type SearchResultItem
} from '../../services/globalSearchService'
import { GlobalSearchResults } from './GlobalSearchResults'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  'Banarasi',
  'Kanchipuram',
  'Pashmina',
  'Ajrakh',
  'Natural Dyes',
  'Handwoven Sarees'
]

const QUICK_ACTIONS = [
  {
    id: 'qa-ai',
    title: 'AI Fashion Assistant',
    badge: 'AI Stylist',
    icon: 'sparkles',
    to: '/ai-fashion-assistant'
  },
  {
    id: 'qa-ar',
    title: 'AR Product Preview',
    badge: 'Virtual Draping',
    icon: 'eye',
    to: '/ar-studio'
  },
  {
    id: 'qa-raw',
    title: 'Raw Materials B2B',
    badge: 'Direct Sourcing',
    icon: 'layers',
    to: '/raw-materials'
  },
  {
    id: 'qa-artisans',
    title: 'Master Artisans',
    badge: 'Weaving Guilds',
    icon: 'users',
    to: '/artisans'
  }
]

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GroupedSearchResults>({
    features: [],
    navigation: [],
    products: [],
    artisans: [],
    actions: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Load recent searches on mount / open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches())
      setActiveIndex(0)
      window.setTimeout(() => inputRef.current?.focus(), 60)
    } else {
      setQuery('')
      setActiveIndex(0)
    }
  }, [isOpen])

  // Flatten current results for keyboard navigation
  const flatItems = useMemo<SearchResultItem[]>(() => {
    const list: SearchResultItem[] = []
    if (results.command) list.push(results.command)
    list.push(...results.products)
    list.push(...results.features)
    list.push(...results.artisans)
    list.push(...results.navigation)
    list.push(...results.actions)
    return list
  }, [results])

  // Execute search with debounce
  useEffect(() => {
    if (!isOpen) return

    let isCurrent = true
    setIsLoading(true)

    const timer = setTimeout(async () => {
      try {
        const userDisplayName = user?.fullName || (user as { name?: string })?.name || ''
        const res = await executeGlobalSearch(query, isAuthenticated, userDisplayName)
        if (isCurrent) {
          setResults(res)
          setActiveIndex(0)
        }
      } catch (err) {
        console.warn('[GlobalSearch] Query execution error:', err)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }, 150)

    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [query, isOpen, isAuthenticated, user])

  // Item Selection Handler
  const handleSelectItem = useCallback((item: SearchResultItem) => {
    if (query.trim()) {
      addRecentSearch(query.trim())
      setRecentSearches(getRecentSearches())
    }
    onClose()
    if (item.to) {
      navigate(item.to)
    }
  }, [query, navigate, onClose])

  // Form Submit Handler
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery) return

    addRecentSearch(cleanQuery)
    setRecentSearches(getRecentSearches())
    onClose()

    // If an item is currently selected by arrow keys, navigate to it
    if (flatItems.length > 0 && activeIndex >= 0 && activeIndex < flatItems.length) {
      navigate(flatItems[activeIndex].to)
    } else if (results.command) {
      navigate(results.command.to)
    } else {
      navigate(`/marketplace?search=${encodeURIComponent(cleanQuery)}`)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (flatItems.length > 0) {
        setActiveIndex(prev => (prev + 1) % flatItems.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (flatItems.length > 0) {
        setActiveIndex(prev => (prev - 1 + flatItems.length) % flatItems.length)
      }
    }
  }

  // Quick Action / Chip Click Handler
  const handleQuickSearch = (term: string) => {
    addRecentSearch(term)
    setRecentSearches(getRecentSearches())
    onClose()
    navigate(`/marketplace?search=${encodeURIComponent(term)}`)
  }

  const handleClearRecents = (e: MouseEvent) => {
    e.stopPropagation()
    clearRecentSearches()
    setRecentSearches([])
  }

  if (!isOpen) return null

  return (
    <div
      className="global-search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Global Search & Navigation Command Bar"
      ref={overlayRef}
      onClick={e => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="global-search-modal">
        {/* Search Header Bar */}
        <form className="global-search-header" onSubmit={handleFormSubmit}>
          <button
            type="submit"
            className="global-search-btn global-search-btn--submit"
            aria-label="Execute search"
          >
            <Icon name="search" size={22} />
          </button>

          <input
            ref={inputRef}
            type="text"
            className="global-search-input"
            placeholder="Search products, artisans, crafts, or commands (e.g. “sarees under ₹20,000”)…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search Handloom Connect"
            autoComplete="off"
            spellCheck={false}
          />

          {isLoading && (
            <div className="global-search-spinner" aria-label="Searching…">
              <span className="global-search-spinner-dot" />
            </div>
          )}

          {query && (
            <button
              type="button"
              className="global-search-btn global-search-btn--clear"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              aria-label="Clear search query"
            >
              <Icon name="close" size={18} />
            </button>
          )}

          <button
            type="button"
            className="global-search-btn global-search-btn--close"
            onClick={onClose}
            aria-label="Close global search"
          >
            <span className="kbd-shortcut">ESC</span>
          </button>
        </form>

        {/* Dynamic Content Area */}
        <div className="global-search-body">
          {query.trim() ? (
            <GlobalSearchResults
              results={results}
              query={query}
              activeIndex={activeIndex}
              flatItems={flatItems}
              onSelect={handleSelectItem}
              onHoverIndex={idx => setActiveIndex(idx)}
            />
          ) : (
            <div className="global-search-discovery">
              {/* Quick Action Feature Shortcuts */}
              <div className="global-search-section">
                <div className="global-search-section-title">
                  <span>Quick Features & Studio</span>
                </div>
                <div className="global-search-quick-grid">
                  {QUICK_ACTIONS.map(qa => (
                    <button
                      key={qa.id}
                      type="button"
                      className="global-search-quick-card"
                      onClick={() => {
                        onClose()
                        navigate(qa.to)
                      }}
                    >
                      <div className="global-search-quick-icon">
                        <Icon name={qa.icon as React.ComponentProps<typeof Icon>['name']} size={20} />
                      </div>
                      <div className="global-search-quick-text">
                        <strong>{qa.title}</strong>
                        <small>{qa.badge}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="global-search-section">
                  <div className="global-search-section-title">
                    <span>Recent Searches</span>
                    <button
                      type="button"
                      className="global-search-clear-recents"
                      onClick={handleClearRecents}
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="global-search-chips">
                    {recentSearches.map(term => (
                      <button
                        key={term}
                        type="button"
                        className="global-search-chip global-search-chip--recent"
                        onClick={() => handleQuickSearch(term)}
                      >
                        <Icon name="clock" size={13} />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="global-search-section">
                <div className="global-search-section-title">
                  <span>Popular Craft Searches</span>
                </div>
                <div className="global-search-chips">
                  {POPULAR_SEARCHES.map(term => (
                    <button
                      key={term}
                      type="button"
                      className="global-search-chip"
                      onClick={() => handleQuickSearch(term)}
                    >
                      <Icon name="tag" size={13} />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Footer Keyboard Hints */}
        <div className="global-search-footer">
          <div className="global-search-footer-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>ESC</kbd> to dismiss</span>
          </div>
          <span className="global-search-footer-brand">
            Handloom Connect GI Intelligence
          </span>
        </div>
      </div>
    </div>
  )
}
