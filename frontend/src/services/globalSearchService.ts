/**
 * Global Search Service & Command Parser for Handloom Connect
 */

import { fetchProducts } from './productService'
import { fetchArtisans } from './artisanService'
export type SearchResultType = 'feature' | 'navigation' | 'product' | 'artisan' | 'action' | 'command'

export interface SearchResultItem {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  badge?: string
  icon?: string
  image?: string
  price?: number
  to: string
  action?: 'logout' | 'open-chat'
  score?: number
}

export interface GroupedSearchResults {
  features: SearchResultItem[]
  navigation: SearchResultItem[]
  products: SearchResultItem[]
  artisans: SearchResultItem[]
  actions: SearchResultItem[]
  command?: SearchResultItem
}

// Category B: Intentional Static Navigation Features Index
// Curated navigational shortcuts to application features. Not database product records.
const STATIC_FEATURES: Array<{
  id: string
  title: string
  subtitle: string
  badge: string
  icon: string
  to: string
  keywords: string[]
}> = [
  {
    id: 'feat-ai-fashion',
    title: 'AI Cultural Fashion Advisor',
    subtitle: 'Get personalized cultural styling, draping, and garment recommendations',
    badge: 'AI Powered',
    icon: 'sparkles',
    to: '/ai-fashion-assistant',
    keywords: ['ai', 'assistant', 'stylist', 'advisor', 'cultural', 'fashion', 'draping', 'recommendations', 'style']
  },

  {
    id: 'feat-ar-studio',
    title: 'AR Product Studio & Preview',
    subtitle: 'Experience 3D holographic craft textures and virtual fabric draping in augmented reality',
    badge: 'Augmented Reality',
    icon: 'eye',
    to: '/ar-studio',
    keywords: ['ar', 'augmented reality', 'virtual preview', '3d', 'hologram', 'studio', 'draping', 'preview']
  },
  {
    id: 'feat-raw-materials',
    title: 'Raw Material Marketplace (B2B)',
    subtitle: 'Direct sourcing of mulberry silk, wild tussar cocoons, organic cotton & natural vat dyes',
    badge: 'B2B Sourcing',
    icon: 'layers',
    to: '/raw-materials',
    keywords: ['raw materials', 'b2b', 'bulk', 'yarn', 'silk yarn', 'cocoons', 'dyes', 'cotton', 'suppliers', 'wholesale']
  },
  {
    id: 'feat-origin-map',
    title: 'Interactive Geographical Craft Map',
    subtitle: 'Explore authentic GI-tagged handloom clusters across Varanasi, Kanchipuram, Kutch, Bengal & Srinagar',
    badge: 'GI Registry',
    icon: 'map-pin',
    to: '/origin-map',
    keywords: ['map', 'origin', 'craft map', 'gi tagged', 'clusters', 'geography', 'regions', 'heritage', 'india']
  },
  {
    id: 'feat-order-tracking',
    title: 'Loom Order & Flight Tracking',
    subtitle: 'Real-time telemetry and milestone tracking from the artisan loom to your doorstep',
    badge: 'Loom Telemetry',
    icon: 'package',
    to: '/order-tracking',
    keywords: ['track', 'tracking', 'order status', 'shipment', 'loom', 'delivery', 'telemetry', 'dispatch']
  },
  {
    id: 'feat-authenticity-passport',
    title: 'Digital Authenticity Passport & QR Stories',
    subtitle: 'Cryptographically verified weaver provenance, loom density metrics and artisan signature',
    badge: 'Verified GI',
    icon: 'shield-check',
    to: '/story/banarasi-katan-silk',
    keywords: ['passport', 'qr', 'story', 'authenticity', 'blockchain', 'verification', 'gi certificate', 'provenance']
  }
]

// Static Navigation Index
const STATIC_NAVIGATION: Array<{
  id: string
  title: string
  subtitle: string
  to: string
  icon: string
  keywords: string[]
}> = [
  {
    id: 'nav-home',
    title: 'Home',
    subtitle: 'Handloom Connect cultural technology platform',
    to: '/',
    icon: 'home',
    keywords: ['home', 'landing', 'main']
  },
  {
    id: 'nav-marketplace',
    title: 'Handloom Marketplace',
    subtitle: 'Explore authentic handwoven sarees, dupattas, stoles, and heirloom textiles',
    to: '/marketplace',
    icon: 'shopping-bag',
    keywords: ['marketplace', 'shop', 'products', 'store', 'collection', 'catalog', 'buy', 'sarees', 'textiles']
  },
  {
    id: 'nav-artisans',
    title: 'Master Artisans & Weaving Guilds',
    subtitle: 'Meet the master weavers, state awardees, and women-led handloom collectives',
    to: '/artisans',
    icon: 'users',
    keywords: ['artisans', 'weavers', 'makers', 'guilds', 'collectives', 'masters', 'craftsmen', 'profiles']
  },

  {
    id: 'nav-cart',
    title: 'Shopping Bag',
    subtitle: 'Review your commissioned handcrafted items and proceed to checkout',
    to: '/cart',
    icon: 'shopping-cart',
    keywords: ['cart', 'bag', 'checkout', 'basket', 'items']
  },
  {
    id: 'nav-wishlist',
    title: 'Curated Wishlist',
    subtitle: 'Saved heritage textiles and artisan pieces',
    to: '/wishlist',
    icon: 'heart',
    keywords: ['wishlist', 'saved', 'favorites', 'bookmarks', 'likes']
  },
  {
    id: 'nav-about',
    title: 'About Handloom Connect',
    subtitle: 'Our mission: Direct trade, GI authenticity, and sustainable loom empowerment',
    to: '/about',
    icon: 'info',
    keywords: ['about', 'mission', 'story', 'manifesto', 'team', 'diploma project']
  },
  {
    id: 'nav-contact',
    title: 'Contact & Atelier Support',
    subtitle: 'Get in touch for custom commissions, heritage consultations, and inquiries',
    to: '/contact',
    icon: 'mail',
    keywords: ['contact', 'help', 'support', 'email', 'inquiry', 'custom', 'atelier']
  }
]

/**
 * Natural-Language Command Parser
 * Identifies natural queries like "sarees under 20000", "pashmina below 15000", "blue silk dupattas"
 */
export function parseNaturalLanguageQuery(query: string): SearchResultItem | null {
  const q = query.trim().toLowerCase()
  if (!q) return null

  // Pattern 1: Price constraint (e.g. "sarees under 20000", "under ₹30,000", "below 15000")
  const priceMatch = q.match(/(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:,[0-9]+)*)/i)
  if (priceMatch) {
    const rawPrice = priceMatch[1].replace(/,/g, '')
    const maxPrice = parseInt(rawPrice, 10)
    if (!isNaN(maxPrice) && maxPrice > 0) {
      const remainingTerm = q.replace(priceMatch[0], '').replace(/(?:show|find|get|products|items)/gi, '').trim()
      const searchParam = remainingTerm ? `&search=${encodeURIComponent(remainingTerm)}` : ''
      return {
        id: `cmd-price-${maxPrice}`,
        type: 'command',
        title: remainingTerm ? `View ${remainingTerm} under ₹${maxPrice.toLocaleString('en-IN')}` : `View all products under ₹${maxPrice.toLocaleString('en-IN')}`,
        subtitle: `Apply filter in Marketplace (Max Price: ₹${maxPrice.toLocaleString('en-IN')})`,
        badge: 'Filter Command',
        icon: 'sliders',
        to: `/marketplace?maxPrice=${maxPrice}${searchParam}`
      }
    }
  }

  // Pattern 2: Category intent (e.g. "show sarees", "browse shawls", "find dupattas")
  const categoryKeywords: Record<string, string> = {
    saree: 'sarees',
    sarees: 'sarees',
    shawl: 'shawls',
    shawls: 'shawls',
    stole: 'stoles',
    stoles: 'stoles',
    dupatta: 'dupattas',
    dupattas: 'dupattas',
    fabric: 'fabrics',
    fabrics: 'fabrics',
    home: 'home-decor',
    linen: 'home-decor'
  }

  for (const [key, catId] of Object.entries(categoryKeywords)) {
    if (q.includes(key)) {
      return {
        id: `cmd-cat-${catId}`,
        type: 'command',
        title: `Explore ${key.toUpperCase()} in Marketplace`,
        subtitle: `Browse all handcrafted ${key} with GI certification`,
        badge: 'Category',
        icon: 'grid',
        to: `/marketplace?category=${catId}`
      }
    }
  }

  return null
}

/**
 * Execute Global Search across Features, Navigation, Products, Artisans & Actions
 */
export async function executeGlobalSearch(
  query: string,
  isAuthenticated = false,
  userDisplayName = ''
): Promise<GroupedSearchResults> {
  const clean = query.trim().toLowerCase()

  // 1. Natural Language Command
  const command = clean ? parseNaturalLanguageQuery(clean) || undefined : undefined

  // 2. User Actions based on Auth State
  const actions: SearchResultItem[] = []
  if (isAuthenticated) {
    if (!clean || 'account profile my orders user logout'.includes(clean) || clean.includes('order') || clean.includes('account') || clean.includes('profile')) {
      actions.push({
        id: 'act-profile',
        type: 'action',
        title: userDisplayName ? `My Account (${userDisplayName})` : 'My Account',
        subtitle: 'View saved addresses, order history, and preferences',
        badge: 'Account',
        icon: 'user',
        to: '/profile'
      })
      actions.push({
        id: 'act-orders',
        type: 'action',
        title: 'My Commissioned Orders',
        subtitle: 'Track active loom commissions and delivery status',
        badge: 'Orders',
        icon: 'package',
        to: '/order-tracking'
      })
    }
  } else {
    if (!clean || 'login sign in register account join'.includes(clean) || clean.includes('login') || clean.includes('register')) {
      actions.push({
        id: 'act-login',
        type: 'action',
        title: 'Sign In to Handloom Connect',
        subtitle: 'Access your commissioned orders and personalized recommendations',
        badge: 'Auth',
        icon: 'log-in',
        to: '/login'
      })
      actions.push({
        id: 'act-register',
        type: 'action',
        title: 'Create an Account',
        subtitle: 'Join the conscious patron community for direct artisan trade',
        badge: 'Register',
        icon: 'user-plus',
        to: '/register'
      })
    }
  }

  // If query is empty, return initial discovery set
  if (!clean) {
    return {
      features: STATIC_FEATURES.slice(0, 4).map(f => ({
        id: f.id,
        type: 'feature',
        title: f.title,
        subtitle: f.subtitle,
        badge: f.badge,
        icon: f.icon,
        to: f.to
      })),
      navigation: STATIC_NAVIGATION.slice(0, 4).map(n => ({
        id: n.id,
        type: 'navigation',
        title: n.title,
        subtitle: n.subtitle,
        icon: n.icon,
        to: n.to
      })),
      products: [],
      artisans: [],
      actions
    }
  }

  // 3. Feature Matches
  const matchedFeatures: SearchResultItem[] = STATIC_FEATURES.filter(f =>
    f.title.toLowerCase().includes(clean) ||
    f.subtitle.toLowerCase().includes(clean) ||
    f.keywords.some(k => k.includes(clean) || clean.includes(k))
  ).map(f => ({
    id: f.id,
    type: 'feature',
    title: f.title,
    subtitle: f.subtitle,
    badge: f.badge,
    icon: f.icon,
    to: f.to
  }))

  // 4. Navigation Matches
  const matchedNavigation: SearchResultItem[] = STATIC_NAVIGATION.filter(n =>
    n.title.toLowerCase().includes(clean) ||
    n.subtitle.toLowerCase().includes(clean) ||
    n.keywords.some(k => k.includes(clean) || clean.includes(k))
  ).map(n => ({
    id: n.id,
    type: 'navigation',
    title: n.title,
    subtitle: n.subtitle,
    icon: n.icon,
    to: n.to
  }))

  // 5. Artisan Matches (Backend query)
  let matchedArtisans: SearchResultItem[] = []
  try {
    const res = await fetchArtisans({ search: clean })
    if (res && Array.isArray(res) && res.length > 0) {
      matchedArtisans = res.slice(0, 4).map(a => ({
        id: `artisan-${a.id}`,
        type: 'artisan',
        title: a.name,
        subtitle: `${a.title || a.craft} · ${a.region}`,
        badge: a.craft,
        image: a.image,
        to: `/artisans/${a.id}`
      }))
    }
  } catch (err) {
    console.error('Failed to search artisans in global search', err)
  }

  // 6. Product Matches (Backend query)
  let matchedProducts: SearchResultItem[] = []
  try {
    const res = await fetchProducts({ search: clean, limit: 5 })
    if (res && Array.isArray(res.products) && res.products.length > 0) {
      matchedProducts = res.products.map(p => ({
        id: `prod-${p.id}`,
        type: 'product',
        title: p.name,
        subtitle: `${p.region} · ${p.material} · ${p.technique}`,
        badge: p.badge || p.category,
        image: p.images?.[0] || '',
        price: p.price,
        to: `/marketplace/${p.id}`
      }))
    }
  } catch (err) {
    console.error('Failed to search products in global search', err)
  }

  return {
    command,
    features: matchedFeatures,
    navigation: matchedNavigation,
    products: matchedProducts,
    artisans: matchedArtisans,
    actions
  }
}

// ─── Recent Searches Helper (Local Storage) ───────────────────────────

const RECENT_SEARCHES_KEY = 'hc_recent_searches'
const MAX_RECENT = 6

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

export function addRecentSearch(term: string): void {
  const trimmed = term.trim()
  if (!trimmed || trimmed.length < 2) return
  try {
    const existing = getRecentSearches()
    const updated = [trimmed, ...existing.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Graceful fallback if localStorage is disabled
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Ignore
  }
}
