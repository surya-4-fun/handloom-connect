export type BodyShape =
  | 'balanced'
  | 'petite'
  | 'athletic'
  | 'curvy'
  | 'tall_slender'
  | 'unspecified'

export interface AIWearPreviewInput {
  productId: string
  height: number
  weight: number
  bodyShape?: BodyShape | string
}

export interface AIWearPreviewResult {
  previewUrl: string
  disclaimer: string
  isMock?: boolean
  product: {
    id: string
    name: string
    category: string
    image: string
    craft: string
    material?: string
    price?: number
    displayPrice?: string
  }
  attributes: {
    height: number
    weight: number
    bodyShape: string
  }
  createdAt: string
}
