export interface GalleryItem {
  id: string
  image: string
  fallbackImage?: string
  eyebrow: string
  title: string
  copy: string
  category: string
  alt: string
  tag?: string
}

export const defaultGalleryItems: GalleryItem[] = [
  {
    id: 'rhythm-at-loom',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
    eyebrow: 'The process',
    title: 'Rhythm at the loom',
    copy: 'A measured exchange of warp and weft, repeated until pattern becomes cloth.',
    category: 'Process',
    alt: 'Master artisan operating a traditional wooden handloom',
    tag: 'Master Craft'
  },
  {
    id: 'maker-visible',
    image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=1200&auto=format&fit=crop',
    eyebrow: 'The person',
    title: 'A maker, visible',
    copy: 'Attribution restores dignity, context and value to the hands behind each piece.',
    category: 'People',
    alt: 'Handloom weaver examining dyed threads with precision',
    tag: 'Artisan Story'
  },
  {
    id: 'texture-tells-truth',
    image: 'https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=1200&auto=format&fit=crop',
    eyebrow: 'The material',
    title: 'Texture tells the truth',
    copy: 'Small variations are not defects. They are evidence of time, tension and touch.',
    category: 'Materials',
    alt: 'Close up of organic handwoven textile material showing rich tactile texture',
    tag: 'Raw Integrity'
  },
  {
    id: 'heritage-heritage-motifs',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    eyebrow: 'The heritage',
    title: 'Motifs of memory',
    copy: 'Geometrical symmetry passed down across generations, preserving cultural heritage in every thread.',
    category: 'Heritage',
    alt: 'Intricate traditional handwoven motif pattern in natural dyed silk',
    tag: 'Ancestral Art'
  }
]
