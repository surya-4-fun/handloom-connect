export type AuthenticityStatus =
  | 'Artisan Verified'
  | 'GI Associated Craft'
  | 'GI Authenticated'
  | 'Ministry Registry Verified'

export interface CraftStage {
  stageNumber: number
  title: string
  subtitle: string
  description: string
  location: string
  weaverNote?: string
  completed: boolean
}

export interface AuthenticityPassport {
  authenticityId: string
  productId: string
  productName: string
  verificationStatus: AuthenticityStatus
  handwovenVerified: boolean
  originVerified: boolean
  giRegistryNo: string
  silkMarkNo: string
  loomType: string
  warpThreadCount: string
  weaveDensity: string
  culturalStory: string
  craftJourney: CraftStage[]
}
