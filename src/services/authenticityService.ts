import { ShopProduct } from '../types/shopTypes'
import { AuthenticityPassport, CraftStage } from '../types/authenticity'
import { getArtisanById } from '../mocks/shopData'

export function getAuthenticityPassport(product: ShopProduct): AuthenticityPassport {
  const artisan = getArtisanById(product.artisanId)
  const productCode = product.id.toUpperCase().replace(/[^A-Z0-0]/g, '')
  const authId = `AUTH-HC-${productCode.substring(0, 4)}-2026-9812`

  const giRegistryNo = product.region.includes('Kanchipuram')
    ? 'GI-4482-TN-SILK'
    : product.region.includes('Varanasi')
    ? 'GI-8821-UP-KATAN'
    : product.region.includes('Bhagalpur')
    ? 'GI-1102-BH-TUSSAR'
    : product.region.includes('Kutch')
    ? 'GI-5520-GJ-AJRAKH'
    : 'GI-9901-IND-GUILD'

  const silkMarkNo = `SM-${product.region.substring(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`

  const journey: CraftStage[] = [
    {
      stageNumber: 1,
      title: 'Raw Material Sourcing',
      subtitle: 'Unadulterated Fiber Harvesting',
      description: `Pure ${product.material} fibers gathered directly from verified indigenous agricultural clusters in ${product.region}.`,
      location: product.region,
      weaverNote: 'Raw thread degummed in natural spring water with zero chemical bleaches.',
      completed: true
    },
    {
      stageNumber: 2,
      title: 'Botanical & Organic Dyeing',
      subtitle: 'Natural Plant Color Extraction',
      description: 'Yarn hank dyeing in small earthen vats using natural madder root, marigold extracts, and fermented indigo.',
      location: `${product.region} Dye Vats`,
      weaverNote: 'Sun-dried on wooden racks over 3 days to fix deep light patina.',
      completed: true
    },
    {
      stageNumber: 3,
      title: 'Pit Loom Warp Setting',
      subtitle: 'Manual Heddle Thread Alignment',
      description: 'Over 2,400 individual warp threads aligned manually through bamboo heddles on a traditional pit loom.',
      location: `${product.region} Atelier Loom`,
      weaverNote: 'Warp tension calibrated for interlocking Korvai / Kadwa border strength.',
      completed: true
    },
    {
      stageNumber: 4,
      title: 'Master Shuttle Weaving',
      subtitle: 'Painstaking Hand Artistry',
      description: `Woven by ${artisan?.name || 'Master Weaver'} using the authentic ${product.technique} technique at ~3.5 cm per hour.`,
      location: `${product.region} Guild Loom`,
      weaverNote: 'Hand-thrown shuttles with pure gold zari thread interlock.',
      completed: true
    },
    {
      stageNumber: 5,
      title: 'Handloom Quality Audit',
      subtitle: 'Craft Quality & Density Audit',
      description: 'Physical density audit (ends x picks per inch), weave integrity inspection, and master weaver signature.',
      location: 'Regional Craft Guild Station',
      weaverNote: 'Inspected for traditional weave density and Geographical Indication (GI) regional association.',
      completed: true
    },
    {
      stageNumber: 6,
      title: 'Express Heirloom Dispatch',
      subtitle: 'Wax Sealed Atelier Packaging',
      description: 'Packed in padded cedarwood cotton dustbags with tamper-evident wax seal and direct express transit.',
      location: 'Handloom Connect Atelier Vault',
      weaverNote: 'Dispatched with signed Certificate of Authenticity.',
      completed: true
    }
  ]

  const culturalStory = `The ${product.name} embodies centuries of ${product.technique} artistry passed down through generations in ${product.region}. Each warp thread is hand-spun and guided on traditional pit looms by ${artisan?.name || 'master weavers'}, preserving a living cultural heritage recognized under India's Geographical Indications (GI) Registry.`

  return {
    authenticityId: authId,
    productId: product.id,
    productName: product.name,
    verificationStatus: 'GI Associated Craft',
    handwovenVerified: true,
    originVerified: true,
    giRegistryNo,
    silkMarkNo,
    loomType: 'Traditional Hand-operated Wooden Pit Loom',
    warpThreadCount: '2,400 Filaments (Double Warp)',
    weaveDensity: '72 Ends/Inch x 68 Picks/Inch',
    culturalStory,
    craftJourney: journey
  }
}
