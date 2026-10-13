export type CameraPermissionState =
  | 'idle'
  | 'prompting'
  | 'active'
  | 'denied'
  | 'unsupported'
  | 'off'

export type StudioBackdrop =
  | 'heritage-palace'
  | 'artisan-atelier'
  | 'minimal-gallery'
  | 'indigo-studio'
  | 'atelier'
  | 'interior'
  | 'daylight'
  | 'gallery'

export interface BackdropPreset {
  id: StudioBackdrop
  label: string
  sublabel: string
  imageUrl: string
  overlayGradient: string
  description: string
  isLight?: boolean
}

export const STUDIO_BACKDROPS: BackdropPreset[] = [
  {
    id: 'heritage-palace',
    label: 'Heritage Palace',
    sublabel: 'Royal Sandstone & Warm Jharokha Glow',
    imageUrl: '/images/backdrops/heritage-palace.jpg',
    overlayGradient: 'radial-gradient(circle at 50% 40%, rgba(30, 20, 14, 0.2) 0%, rgba(12, 8, 5, 0.78) 100%)',
    description: 'Refined Indian heritage architecture, warm lighting, and traditional design details.',
    isLight: false
  },
  {
    id: 'artisan-atelier',
    label: 'Artisan Atelier',
    sublabel: 'Timber Pit Loom Workshop Atmosphere',
    imageUrl: '/images/backdrops/artisan-atelier.jpg',
    overlayGradient: 'radial-gradient(circle at 50% 40%, rgba(26, 18, 10, 0.22) 0%, rgba(10, 7, 3, 0.8) 100%)',
    description: 'Authentic handloom workshop atmosphere with natural wooden loom textures.',
    isLight: false
  },
  {
    id: 'minimal-gallery',
    label: 'Minimal Gallery',
    sublabel: 'Warm Ivory & Limestone Editorial Plinth',
    imageUrl: '/images/backdrops/minimal-gallery.jpg',
    overlayGradient: 'linear-gradient(180deg, rgba(248, 244, 238, 0.05) 0%, rgba(220, 212, 200, 0.25) 100%)',
    description: 'Clean ivory and travertine background with soft architectural shadows.',
    isLight: true
  },
  {
    id: 'indigo-studio',
    label: 'Indigo Studio',
    sublabel: 'Midnight Dye Weave & Brass Accents',
    imageUrl: '/images/backdrops/indigo-studio.jpg',
    overlayGradient: 'radial-gradient(circle at 50% 40%, rgba(12, 20, 36, 0.25) 0%, rgba(4, 8, 15, 0.82) 100%)',
    description: 'Elegant indigo tones and restrained textile-inspired textures.',
    isLight: false
  }
]

export function getBackdropPreset(id?: StudioBackdrop): BackdropPreset {
  if (!id) return STUDIO_BACKDROPS[0]
  // Normalize legacy aliases
  let targetId: StudioBackdrop = id
  if (id === 'atelier') targetId = 'artisan-atelier'
  else if (id === 'interior') targetId = 'heritage-palace'
  else if (id === 'daylight') targetId = 'minimal-gallery'
  else if (id === 'gallery') targetId = 'indigo-studio'

  const found = STUDIO_BACKDROPS.find(b => b.id === targetId)
  return found || STUDIO_BACKDROPS[0]
}

export interface ARTransformState {
  x: number
  y: number
  scale: number
  rotation: number
}

export interface ARProductPreviewProps {
  productId?: string
}
