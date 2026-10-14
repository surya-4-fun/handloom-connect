/* ─── Shop Data & Static UI Definitions ──────────────────────────────
   SHOP_REGIONS: Curated static craft cluster definitions for RegionDiscovery
──────────────────────────────────────────────────────────────────── */

import type { ShopRegion } from '../../types/shopTypes'

/* ─── Regions for Discovery ──────────────────────────────────────── */

export const SHOP_REGIONS: ShopRegion[] = [
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    crafts: ['Banarasi Brocade', 'Zari Work', 'Chikankari'],
    image: '/images/regions/varanasi.jpg',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    state: 'Jammu & Kashmir',
    crafts: ['Pashmina', 'Sozni', 'Kani Weave'],
    image: '/images/regions/kashmir.jpg',
  },
  {
    id: 'kutch',
    name: 'Kutch',
    state: 'Gujarat',
    crafts: ['Ajrakh', 'Bandhani', 'Natural Indigo'],
    image: '/images/regions/kutch.jpg',
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    state: 'Tamil Nadu',
    crafts: ['Korvai Silk', 'Temple Border'],
    image: '/images/regions/kanchipuram.jpg',
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    state: 'West Bengal',
    crafts: ['Jamdani', 'Baluchari', 'Fine Muslin'],
    image: '/images/regions/west-bengal.jpg',
  },
  {
    id: 'bhagalpur',
    name: 'Bhagalpur',
    state: 'Bihar',
    crafts: ['Tussar Silk', 'Natural Dye'],
    image: '/images/regions/bhagalpur.jpg',
  },
]
