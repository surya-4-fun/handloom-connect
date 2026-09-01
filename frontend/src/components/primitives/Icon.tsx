import type { ReactNode } from 'react'

type IconName =
  | 'search' | 'heart' | 'heart-filled' | 'bag' | 'user'
  | 'sun' | 'moon' | 'menu' | 'close' | 'arrow' | 'arrow-right' | 'sparkles'
  | 'cube' | 'shield' | 'leaf' | 'quote' | 'package' | 'sliders'
  | 'compass' | 'layers' | 'book' | 'book-open' | 'mail' | 'info' | 'clock' | 'tag' | 'map-pin'
  | 'filter' | 'grid' | 'sort' | 'eye' | 'plus' | 'minus' | 'users'
  | 'check' | 'star' | 'chevron-down' | 'chevron-left' | 'chevron-right'
  | 'x' | 'shield-check' | 'log-in' | 'user-plus' | 'shopping-bag' | 'shopping-cart'

const paths: Record<IconName, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
  'heart-filled': <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" fill="currentColor"/>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  'shopping-bag': <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  'shopping-cart': <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  'log-in': <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></>,
  'user-plus': <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  'arrow-right': <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  sparkles: <><path d="m12 3 1.2 3.2L16 8l-2.8 1.8L12 13l-1.2-3.2L8 8l2.8-1.8L12 3Z"/><path d="m5 14 .8 2.2L8 17.5l-2.2 1.3L5 21l-.8-2.2L2 17.5l2.2-1.3L5 14ZM19 12l.8 1.8 1.7 1.2-1.7 1.2L19 18l-.8-1.8-1.7-1.2 1.7-1.2L19 12Z"/></>,
  cube: <><path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Z"/><path d="m4 6.5 8 4.5 8-4.5M12 11v9"/></>,
  shield: <path d="M12 3 20 6v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z"/>,
  'shield-check': <><path d="M12 3 20 6v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z"/><polyline points="9 12 11 14 15 10"/></>,
  leaf: <><path d="M20 4C11 4 5 8 5 14c0 3 2 5 5 5 6 0 10-6 10-15Z"/><path d="M4 21c3-5 7-8 13-12"/></>,
  quote: <><path d="M5 11h5v7H4v-6c0-4 2-6 6-7v3c-3 .5-5 1.5-5 3ZM15 11h5v7h-6v-6c0-4 2-6 6-7v3c-3 .5-5 1.5-5 3Z"/></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
  sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  sort: <><path d="M3 6h18M6 12h12M9 18h6"/></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  check: <path d="M5 12l5 5L20 7"/>,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z"/>,
  x: <><path d="m6 6 12 12M18 6 6 18"/></>,
  'chevron-down': <path d="m6 9 6 6 6-6"/>,
  'chevron-left': <path d="m15 6-6 6 6 6"/>,
  'chevron-right': <path d="m9 6 6 6-6 6"/>,
  package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  compass: <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
  layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  'book-open': <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  'map-pin': <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
}

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths['search']}</svg>
}
