export interface Product360Image {
  sequence: number
  url: string
  angleLabel?: string
}

export interface CraftHotspot {
  id: string
  title: string
  description: string
  xPercent: number
  yPercent: number
  craftFacet: string
}

export interface Product360Data {
  productId: string
  productName: string
  slug?: string
  has360: boolean
  images: Product360Image[]
  craftDetails?: {
    weave: string
    material: string
    region: string
    dimensions?: string
    care?: string
  }
  passport?: {
    authenticityId?: string
    verificationStatus?: string
    handwovenVerified?: boolean
    originVerified?: boolean
    giRegistryNo?: string
    silkMarkNo?: string
    loomType?: string
    warpThreadCount?: string
    weaveDensity?: string
    culturalStory?: string
    craftJourney?: Array<{
      stageNumber: number
      title: string
      subtitle?: string
      description: string
      location?: string
      weaverNote?: string
    }>
  } | null
  artisan?: {
    id: string
    name: string
    title?: string
    region?: string
    craft?: string
    image?: string
  } | null
  hotspots?: CraftHotspot[]
}
