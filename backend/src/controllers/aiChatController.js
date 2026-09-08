import axios from 'axios'
import { sendSuccess, sendError } from '../utils/response.js'
import { productModel } from '../models/productModel.js'
import { artisanModel } from '../models/artisanModel.js'
import { rawMaterialModel } from '../models/rawMaterialModel.js'
import { userModel } from '../models/userModel.js'

const FASTAPI_TIMEOUT = 15000
const MAX_CONTEXT_BYTES = 8000

/**
 * Deterministic natural language intent extractor for handloom recommendations.
 */
function extractRecommendationIntent(message, context = {}) {
  const text = (message || '').toLowerCase()

  // 1. Category extraction
  let category = null
  if (/\b(?:sarees?|saris?)\b/.test(text)) category = 'sarees'
  else if (/\b(?:shawls?)\b/.test(text)) category = 'shawls'
  else if (/\b(?:dupattas?)\b/.test(text)) category = 'dupattas'
  else if (/\b(?:kurtas?|kurtis?)\b/.test(text)) category = 'kurtas'
  else if (/\b(?:stoles?|scarfs?|scarves)\b/.test(text)) category = 'stoles'
  else if (/\b(?:throws?|cushions?|bedsheets?|rugs?|textiles?|home)\b/.test(text)) category = 'home-textiles'
  else if (/\b(?:accessories|accessory|bags?|clutch(?:es)?)\b/.test(text)) category = 'accessories'

  // 2. Price constraints
  let maxPrice = null
  let minPrice = null

  const underMatch = text.match(/(?:under|below|less than|within|max(?:imum)?|up to|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i)
  if (underMatch) {
    const parsed = parseInt(underMatch[1].replace(/,/g, ''), 10)
    if (!isNaN(parsed) && parsed > 0) maxPrice = parsed
  }

  const aboveMatch = text.match(/(?:above|more than|greater than|at least|minimum)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i)
  if (aboveMatch) {
    const parsed = parseInt(aboveMatch[1].replace(/,/g, ''), 10)
    if (!isNaN(parsed) && parsed > 0) minPrice = parsed
  }

  const rangeMatch = text.match(/(?:between|from)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)\s*(?:and|to|-)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i)
  if (rangeMatch) {
    const p1 = parseInt(rangeMatch[1].replace(/,/g, ''), 10)
    const p2 = parseInt(rangeMatch[2].replace(/,/g, ''), 10)
    if (!isNaN(p1) && !isNaN(p2)) {
      minPrice = Math.min(p1, p2)
      maxPrice = Math.max(p1, p2)
    }
  }

  // 3. Material extraction
  const materials = []
  const materialKeywords = ['silk', 'cotton', 'pashmina', 'wool', 'zari', 'tussar', 'khadi', 'modal', 'muslin', 'katan', 'linen', 'kala cotton']
  for (const mat of materialKeywords) {
    if (text.includes(mat)) materials.push(mat)
  }

  // 4. Region extraction
  const regions = []
  const regionKeywords = ['chanderi', 'varanasi', 'kanchipuram', 'kashmir', 'srinagar', 'kullu', 'kutch', 'phulia', 'pochampally', 'bhagalpur', 'shantiniketan', 'bengal', 'gujarat', 'himachal']
  for (const reg of regionKeywords) {
    if (text.includes(reg)) regions.push(reg)
  }

  // 5. Technique extraction
  const techniques = []
  const techniqueKeywords = ['brocade', 'korvai', 'jamdani', 'ikat', 'ajrakh', 'kantha', 'sozni', 'kani', 'block print', 'handloom', 'pit loom']
  for (const tech of techniqueKeywords) {
    if (text.includes(tech)) techniques.push(tech)
  }

  // 6. Occasion & Theme extraction
  const occasions = []
  if (/\b(?:wedding|bridal|bride|groom|marriage|reception|shaadi|trousseau)\b/.test(text)) occasions.push('wedding')
  if (/\b(?:formal|office|ceremony|ceremonies|gala|banquet|auspicious)\b/.test(text)) occasions.push('formal')
  if (/\b(?:summer|lightweight|breathable|hot|cool|breeze|hot weather|cool weather|monsoon)\b/.test(text)) occasions.push('summer')
  if (/\b(?:winter|warm|cold|chill|snow)\b/.test(text)) occasions.push('winter')
  if (/\b(?:traditional|heritage|classic|vintage|ancestral|culture|cultural|festival|festivals|celebration|celebrations|traditional events?|puja|diwali|holi|eid)\b/.test(text)) occasions.push('traditional')
  if (/\b(?:casual|everyday|daily|simple|everyday wear)\b/.test(text)) occasions.push('casual')
  if (/\b(?:gift|gifting|present|gifts)\b/.test(text)) occasions.push('gifting')

  // 7. Similarity check
  const isSimilarity = /\b(?:similar|like this|alternative|resemble|equivalent|compare to this)\b/.test(text)

  // 8. Availability preference
  const inStockOnly = /\b(?:in stock|available|ready to ship)\b/.test(text)

  // 9. Query categorization: whether this is a product recommendation / search intent
  const isRecommendationQuery = Boolean(
    category || 
    maxPrice !== null || 
    minPrice !== null || 
    materials.length > 0 || 
    regions.length > 0 || 
    techniques.length > 0 || 
    occasions.length > 0 || 
    isSimilarity ||
    /\b(?:recommend|suggest|show me|find|search|options?|best for me|which product|buy|purchase|suitable|options)\b/.test(text)
  )

  return {
    category,
    minPrice,
    maxPrice,
    materials,
    regions,
    techniques,
    occasions,
    isSimilarity,
    inStockOnly,
    isRecommendationQuery
  }
}

/**
 * Deterministic scoring and ranking for candidate products from MySQL.
 */
function rankCandidates(products, intent, selectedProduct = null) {
  const scored = products.map(p => {
    let score = 0
    let reasons = []

    // Similarity scoring if user is viewing a product or requested similar items
    if (intent.isSimilarity && selectedProduct) {
      if (p.id === selectedProduct.id || (selectedProduct.slug && p.slug === selectedProduct.slug)) {
        // Exclude the currently viewed product from similar recommendations
        return { product: p, score: -9999, reasons: ['self'] }
      }
      if (selectedProduct.category && (p.category === selectedProduct.category || p.category_id === selectedProduct.category)) {
        score += 35
        reasons.push(`Same category (${p.category})`)
      }
      if (selectedProduct.material && p.material) {
        const selMats = selectedProduct.material.toLowerCase()
        const pMats = p.material.toLowerCase()
        if (selMats.includes('silk') && pMats.includes('silk')) { score += 20; reasons.push('Silk craft') }
        else if (selMats.includes('cotton') && pMats.includes('cotton')) { score += 20; reasons.push('Cotton craft') }
        else if (selMats.includes('wool') && pMats.includes('wool')) { score += 20; reasons.push('Wool craft') }
        else if (selMats.includes('pashmina') && pMats.includes('pashmina')) { score += 20; reasons.push('Pashmina craft') }
      }
      if (selectedProduct.region && p.region) {
        const selReg = selectedProduct.region.split(',')[0].trim().toLowerCase()
        if (p.region.toLowerCase().includes(selReg)) {
          score += 15
          reasons.push(`Regional link (${selReg})`)
        }
      }
    } else if (selectedProduct && intent.isSimilarity && (p.id === selectedProduct.id || (selectedProduct.slug && p.slug === selectedProduct.slug))) {
      return { product: p, score: -9999, reasons: ['self'] }
    }

    // 1. Category match
    if (intent.category) {
      if (p.category === intent.category || p.category_id === intent.category) {
        score += 35
        reasons.push(`${intent.category} category match`)
      } else {
        score -= 20
      }
    }

    // 2. Price constraints
    const priceNum = Number(p.price)
    if (intent.maxPrice !== null) {
      if (priceNum <= intent.maxPrice) {
        score += 30
        reasons.push(`Within budget (₹${priceNum.toLocaleString('en-IN')})`)
      } else {
        score -= 60
      }
    }
    if (intent.minPrice !== null) {
      if (priceNum >= intent.minPrice) {
        score += 15
      } else {
        score -= 30
      }
    }

    // 3. Material match
    if (intent.materials.length > 0 && p.material) {
      const pMat = p.material.toLowerCase()
      for (const mat of intent.materials) {
        if (pMat.includes(mat)) {
          score += 25
          reasons.push(`${mat} material match`)
          break
        }
      }
    }

    // 4. Region match
    if (intent.regions.length > 0 && p.region) {
      const pReg = p.region.toLowerCase()
      for (const reg of intent.regions) {
        if (pReg.includes(reg)) {
          score += 25
          reasons.push(`${reg} origin match`)
          break
        }
      }
    }

    // 5. Technique match
    if (intent.techniques.length > 0 && p.technique) {
      const pTech = p.technique.toLowerCase()
      for (const tech of intent.techniques) {
        if (pTech.includes(tech)) {
          score += 20
          reasons.push(`${tech} technique`)
          break
        }
      }
    }

    // 6. Occasion / theme matching
    const pFullDesc = `${p.name} ${p.material || ''} ${p.technique || ''} ${p.description || ''} ${p.badge || ''}`.toLowerCase()
    if (intent.occasions.includes('wedding')) {
      if (pFullDesc.includes('zari') || pFullDesc.includes('brocade') || pFullDesc.includes('katan') || pFullDesc.includes('korvai') || pFullDesc.includes('silk')) {
        score += 20
        reasons.push('Wedding & festive heritage weave')
      }
    }
    if (intent.occasions.includes('formal')) {
      if (pFullDesc.includes('silk') || pFullDesc.includes('korvai') || pFullDesc.includes('zari') || pFullDesc.includes('chanderi')) {
        score += 15
        reasons.push('Formal occasion styling')
      }
    }
    if (intent.occasions.includes('summer') || intent.occasions.includes('casual')) {
      if (pFullDesc.includes('cotton') || pFullDesc.includes('muslin') || pFullDesc.includes('chanderi') || pFullDesc.includes('khadi') || pFullDesc.includes('lightweight')) {
        score += 20
        reasons.push('Lightweight & breathable drape')
      }
    }
    if (intent.occasions.includes('winter')) {
      if (pFullDesc.includes('pashmina') || pFullDesc.includes('wool') || pFullDesc.includes('sozni') || pFullDesc.includes('kani')) {
        score += 25
        reasons.push('Warm natural insulation')
      }
    }
    if (intent.occasions.includes('traditional') || intent.occasions.includes('gifting')) {
      if (pFullDesc.includes('handwoven') || pFullDesc.includes('authentic') || pFullDesc.includes('traditional') || pFullDesc.includes('heritage')) {
        score += 15
        reasons.push('Traditional heritage piece')
      }
    }

    // 7. Stock status
    if (p.inStock) {
      score += 10
    } else {
      score -= 25
    }

    // 8. Quality/Popularity badge bonus
    if (p.badge === 'Bestseller') score += 5
    if (p.badge === 'Handwoven') score += 3

    return { product: p, score, reasons }
  })

  // Filter out heavily penalized items
  const valid = scored.filter(s => s.score > -100)

  // Sort descending by score; tie-break by inStock then price
  valid.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if ((b.product.inStock ? 1 : 0) !== (a.product.inStock ? 1 : 0)) {
      return (b.product.inStock ? 1 : 0) - (a.product.inStock ? 1 : 0)
    }
    return Number(a.product.price) - Number(b.product.price)
  })

  return valid
}

/**
 * Deterministic natural language intent extractor for handloom raw materials.
 */
function extractMaterialIntent(message, context = {}) {
  const text = (message || '').toLowerCase()
  const currentPage = (context?.currentPage || '').toLowerCase()

  // 1. Material category extraction
  let category = null
  if (/\b(?:silk yarn|silk raw material|silk filaments?)\b/.test(text)) category = 'Silk Yarn'
  else if (/\b(?:cotton yarn|cotton raw material)\b/.test(text)) category = 'Cotton Yarn'
  else if (/\b(?:wool|pashm|merino)\b/.test(text)) category = 'Wool'
  else if (/\b(?:indigo|natural dyes?|dye extract)\b/.test(text)) category = 'Indigo'
  else if (/\b(?:zari wire|metallic thread|weaving materials?|shuttle)\b/.test(text)) category = 'Weaving Materials'

  // 2. Fiber / Material type keywords
  const types = []
  const typeKeywords = ['mulberry', 'tussar', 'ahimsa', 'kala cotton', 'muslin', 'pashm', 'wool', 'cotton', 'silk', 'indigo', 'zari']
  for (const t of typeKeywords) {
    if (text.includes(t)) types.push(t)
  }

  // 3. Price constraints
  let maxPrice = null
  let minPrice = null

  const underMatch = text.match(/(?:under|below|less than|within|max(?:imum)?|up to|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i)
  if (underMatch) {
    const parsed = parseInt(underMatch[1].replace(/,/g, ''), 10)
    if (!isNaN(parsed) && parsed > 0) maxPrice = parsed
  }

  const aboveMatch = text.match(/(?:above|more than|greater than|at least|minimum)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i)
  if (aboveMatch) {
    const parsed = parseInt(aboveMatch[1].replace(/,/g, ''), 10)
    if (!isNaN(parsed) && parsed > 0) minPrice = parsed
  }

  // 4. Origin / region
  const origins = []
  const originKeywords = ['kanchipuram', 'bhagalpur', 'kutch', 'phulia', 'ladakh', 'changthang', 'bhuj', 'varanasi']
  for (const o of originKeywords) {
    if (text.includes(o)) origins.push(o)
  }

  // 5. Use case / attributes
  const useCases = []
  if (/\b(?:lightweight|sheer|fine|delicate)\b/.test(text)) useCases.push('lightweight')
  if (/\b(?:summer|breathable|cool|absorbent)\b/.test(text)) useCases.push('summer')
  if (/\b(?:winter|warm|insulating|thermal)\b/.test(text)) useCases.push('winter')
  if (/\b(?:durable|high-tensile|strong|warp)\b/.test(text)) useCases.push('durable')
  if (/\b(?:organic|rain-fed|sustainable|eco|botanical)\b/.test(text)) useCases.push('organic')
  if (/\b(?:brocade|korvai|border|embroidery)\b/.test(text)) useCases.push('brocade')

  // 6. Comparison check
  const isComparison = /\b(?:compare|difference between|versus|vs\.?|which is better)\b/.test(text)

  // 7. Product-to-material check
  const isProductMaterialQuery = (
    Boolean(context?.productId || context?.selectedProduct) &&
    /\b(?:what material is (?:this|used)|made from|suitable (?:for this|material)|craft fiber|yarn used)\b/.test(text)
  )

  // 8. Overall material query classification
  const hasMaterialContext = Boolean(context?.rawMaterialId || context?.materialId || currentPage === 'raw_materials')
  const hasExplicitMaterialTerms = /\b(?:raw materials?|yarns?|fibers?|fibres?|filaments?|hanks?|deniers?|slub|spools?|natural dyes?|pashm)\b/.test(text)
  const isMaterialSeekingQuestion = (
    /\b(?:what material|which material|recommend (?:a |some )?material|material under|suitable material|material for|durable material)\b/.test(text) ||
    isProductMaterialQuery
  )

  const isMaterialQuery = Boolean(
    hasMaterialContext ||
    hasExplicitMaterialTerms ||
    isMaterialSeekingQuestion ||
    (isComparison && types.length > 0) ||
    category !== null
  )

  return {
    category,
    types,
    maxPrice,
    minPrice,
    origins,
    useCases,
    isComparison,
    isProductMaterialQuery,
    isMaterialQuery
  }
}

/**
 * Deterministic scoring and ranking for raw materials from MySQL.
 */
function rankMaterialCandidates(materials, intent, selectedProduct = null) {
  const scored = materials.map(m => {
    let score = 0
    let reasons = []

    // 1. Product-to-material matching
    if (intent.isProductMaterialQuery && selectedProduct?.material) {
      const prodMat = selectedProduct.material.toLowerCase()
      const mText = `${m.name} ${m.category} ${m.materialType || ''} ${m.description || ''}`.toLowerCase()

      if (prodMat.includes('silk') && (mText.includes('silk') || m.category === 'Silk Yarn')) {
        score += 40
        reasons.push('Matches product silk composition')
      }
      if (prodMat.includes('cotton') && (mText.includes('cotton') || m.category === 'Cotton Yarn')) {
        score += 40
        reasons.push('Matches product cotton composition')
      }
      if (prodMat.includes('zari') && (mText.includes('zari') || m.category === 'Weaving Materials')) {
        score += 40
        reasons.push('Matches product zari embellishment')
      }
      if (prodMat.includes('pashmina') && (mText.includes('pashm') || m.category === 'Wool')) {
        score += 40
        reasons.push('Matches product pashmina composition')
      }
      if (prodMat.includes('wool') && mText.includes('wool')) {
        score += 40
        reasons.push('Matches product wool composition')
      }
    }

    // 2. Category match
    if (intent.category) {
      if (m.category === intent.category) {
        score += 35
        reasons.push(`${m.category} category match`)
      } else {
        score -= 20
      }
    }

    // 3. Fiber type keywords match
    if (intent.types.length > 0) {
      const mFullText = `${m.name} ${m.materialType || ''} ${m.category} ${m.description || ''}`.toLowerCase()
      for (const t of intent.types) {
        if (mFullText.includes(t)) {
          score += 30
          reasons.push(`${t} fiber match`)
          break
        }
      }
    }

    // 4. Price constraints
    const priceNum = Number(m.price)
    if (intent.maxPrice !== null) {
      if (priceNum <= intent.maxPrice) {
        score += 30
        reasons.push(`Within budget (₹${priceNum.toLocaleString('en-IN')})`)
      } else {
        score -= 60
      }
    }
    if (intent.minPrice !== null) {
      if (priceNum >= intent.minPrice) {
        score += 15
      } else {
        score -= 30
      }
    }

    // 5. Origin match
    if (intent.origins.length > 0 && m.origin) {
      const mOrigin = m.origin.toLowerCase()
      for (const o of intent.origins) {
        if (mOrigin.includes(o)) {
          score += 25
          reasons.push(`${o} origin match`)
          break
        }
      }
    }

    // 6. Use case / attributes match
    const mFullDesc = `${m.name} ${m.materialType || ''} ${m.sustainabilityInfo || ''} ${m.description || ''} ${m.quality || ''}`.toLowerCase()
    if (intent.useCases.includes('lightweight')) {
      if (mFullDesc.includes('featherlight') || mFullDesc.includes('100s') || mFullDesc.includes('20/22') || mFullDesc.includes('fine')) {
        score += 20
        reasons.push('Lightweight & fine count fiber')
      }
    }
    if (intent.useCases.includes('summer')) {
      if (mFullDesc.includes('cotton') || mFullDesc.includes('absorbent') || mFullDesc.includes('breathable') || mFullDesc.includes('fine muslin')) {
        score += 20
        reasons.push('Cool & breathable for warm climates')
      }
    }
    if (intent.useCases.includes('winter')) {
      if (mFullDesc.includes('wool') || mFullDesc.includes('pashm') || mFullDesc.includes('thermal') || mFullDesc.includes('insulating')) {
        score += 25
        reasons.push('Thermal insulation properties')
      }
    }
    if (intent.useCases.includes('durable')) {
      if (mFullDesc.includes('high-tensile') || mFullDesc.includes('double warp') || mFullDesc.includes('resilient')) {
        score += 25
        reasons.push('High-tensile & durable handloom warp')
      }
    }
    if (intent.useCases.includes('organic')) {
      if (mFullDesc.includes('organic') || mFullDesc.includes('ahimsa') || mFullDesc.includes('zero pesticide') || mFullDesc.includes('carbon-negative')) {
        score += 20
        reasons.push('Certified organic & sustainable processing')
      }
    }

    // 7. Stock status
    if (m.inStock) {
      score += 10
    } else {
      score -= 25
    }

    return { material: m, score, reasons }
  })

  // Filter out heavily penalized items
  const valid = scored.filter(s => s.score > -100)

  // Sort descending by score; tie-break by price
  valid.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Number(a.material.price) - Number(b.material.price)
  })

  return valid
}

export const aiChatController = {
  /**
   * Forward a chat request to the Python FastAPI service with
   * secure, minimal, validated Handloom Connect application context.
   * POST /api/ai/chat
   */
  async processChat(req, res) {
    try {
      const { message, history, context } = req.body

      // 1. Basic validation
      if (!message || message.trim() === '') {
        return sendError(res, 'Message is required', 400)
      }

      if (message.length > 1000) {
        return sendError(res, 'Message is too long (max 1000 characters)', 400)
      }

      // 2. Validate context payload size limit
      if (context && typeof context === 'object') {
        const contextStr = JSON.stringify(context)
        if (contextStr.length > MAX_CONTEXT_BYTES) {
          return sendError(res, `Context payload exceeds maximum allowed size (${MAX_CONTEXT_BYTES} bytes)`, 400)
        }
      }

      // 3. User Identity & Preferences Security
      // Never trust browser-supplied userId or userPreferences.
      // Use verified identity attached by auth middleware (req.user).
      let userRole = 'guest'
      let userPreferences = null

      if (req.user && req.user.id) {
        userRole = req.user.role || 'customer'
        try {
          const prefs = await userModel.getPreferences(req.user.id)
          if (prefs) {
            userPreferences = {
              currency: String(prefs.currency || 'INR'),
              theme: String(prefs.theme || 'dark')
            }
          }
        } catch (prefErr) {
          console.warn('Could not retrieve user preferences for AI context:', prefErr.message)
        }
      }

      // 4. Entity Context Resolution (Data Minimization)
      let selectedProduct = null
      let selectedArtisan = null
      let selectedRawMaterial = null

      // Resolve Selected Product if requested
      const productId = context?.productId || 
                        context?.selectedProductId || 
                        (typeof context?.selectedProduct === 'object' ? context?.selectedProduct?.id : context?.selectedProduct)

      if (productId && typeof productId === 'string' && productId.trim()) {
        try {
          const product = await productModel.getByIdOrSlug(productId.trim())
          if (product) {
            let artisanName = null
            if (product.artisanId) {
              const art = await artisanModel.getById(product.artisanId)
              artisanName = art?.name || null
            }
            selectedProduct = {
              id: String(product.id),
              name: String(product.name),
              category: product.category ? String(product.category) : null,
              price: product.displayPrice ? String(product.displayPrice) : `₹${product.price}`,
              material: product.material ? String(product.material) : null,
              region: product.region ? String(product.region) : null,
              technique: product.technique ? String(product.technique) : null,
              description: product.description ? String(product.description).slice(0, 1000) : null,
              care: product.care ? String(product.care).slice(0, 250) : null,
              provenance: product.provenance ? String(product.provenance).slice(0, 250) : null,
              in_stock: Boolean(product.inStock),
              artisan_name: artisanName
            }
          }
        } catch (dbErr) {
          console.warn('Error querying product for AI context:', dbErr.message)
        }
      }

      // Resolve Selected Artisan if requested
      const artisanId = context?.artisanId || 
                        context?.selectedArtisanId || 
                        (typeof context?.selectedArtisan === 'object' ? context?.selectedArtisan?.id : context?.selectedArtisan)

      if (artisanId && typeof artisanId === 'string' && artisanId.trim()) {
        try {
          const artisan = await artisanModel.getById(artisanId.trim())
          if (artisan) {
            selectedArtisan = {
              id: String(artisan.id),
              name: String(artisan.name),
              title: artisan.title ? String(artisan.title) : null,
              region: String(artisan.region),
              craft: String(artisan.craft),
              specialty: artisan.specialty ? String(artisan.specialty) : null,
              experience: String(artisan.experience),
              bio: artisan.bio ? String(artisan.bio).slice(0, 1000) : null,
              techniques: Array.isArray(artisan.techniques) ? artisan.techniques.slice(0, 5).map(String) : []
            }
          }
        } catch (dbErr) {
          console.warn('Error querying artisan for AI context:', dbErr.message)
        }
      }

      // Resolve Selected Raw Material if requested
      const rawMaterialId = context?.rawMaterialId || 
                            context?.materialId || 
                            context?.selectedRawMaterialId || 
                            (typeof context?.selectedRawMaterial === 'object' ? context?.selectedRawMaterial?.id : context?.selectedRawMaterial)

      if (rawMaterialId && typeof rawMaterialId === 'string' && rawMaterialId.trim()) {
        try {
          const mat = await rawMaterialModel.getById(rawMaterialId.trim())
          if (mat) {
            selectedRawMaterial = {
              id: String(mat.id),
              name: String(mat.name),
              category: String(mat.category),
              material_type: String(mat.materialType),
              origin: String(mat.origin),
              quality: String(mat.quality),
              price: mat.displayPrice ? String(mat.displayPrice) : `₹${mat.price}`,
              sustainability_info: mat.sustainabilityInfo ? String(mat.sustainabilityInfo).slice(0, 500) : null,
              description: mat.description ? String(mat.description).slice(0, 1000) : null,
              supplier_name: mat.supplier?.name ? String(mat.supplier.name) : null
            }
          }
        } catch (dbErr) {
          console.warn('Error querying raw material for AI context:', dbErr.message)
        }
      }

      // 5. Server-Side Recommendation & Product Retrieval
      // The backend is the authoritative source of truth. Discard any client-supplied
      // product candidates to prevent client-side product/price spoofing.
      let productCandidates = []

      const intent = extractRecommendationIntent(message, context)

      if (intent.isRecommendationQuery || intent.isSimilarity) {
        try {
          // Query real candidate products from MySQL
          const allProductsRes = await productModel.getAll({ limit: 50 })
          const allProducts = allProductsRes?.products || []

          if (allProducts.length > 0) {
            const ranked = rankCandidates(allProducts, intent, selectedProduct)
            
            // Only include candidates with positive relevance score
            const matchingCandidates = ranked.filter(r => r.score > 0)

            // Strictly bounded to maximum 6 candidates
            productCandidates = matchingCandidates.slice(0, 6).map(r => ({
              id: String(r.product.id),
              name: String(r.product.name).slice(0, 200),
              craft: r.product.technique ? String(r.product.technique).slice(0, 150) : (r.product.category ? String(r.product.category).slice(0, 100) : 'Handloom'),
              price: r.product.displayPrice ? String(r.product.displayPrice).slice(0, 50) : `₹${r.product.price}`,
              region: r.product.region ? String(r.product.region).slice(0, 150) : null,
              material: r.product.material ? String(r.product.material).slice(0, 150) : null,
              category: r.product.category ? String(r.product.category).slice(0, 100) : null,
              in_stock: Boolean(r.product.inStock),
              description: r.product.description ? String(r.product.description).slice(0, 250) : null
            }))
          }
        } catch (dbErr) {
          console.warn('Error querying product candidates for AI context:', dbErr.message)
        }
      }

      // 6. Server-Side Raw Material Retrieval & Recommendation
      // The backend is the authoritative source of truth. Discard any client-supplied
      // material candidates to prevent client-side material/price spoofing.
      let materialCandidates = []
      const materialIntent = extractMaterialIntent(message, context)

      if (materialIntent.isMaterialQuery) {
        try {
          const allMaterials = await rawMaterialModel.getAll()
          if (Array.isArray(allMaterials) && allMaterials.length > 0) {
            const rankedMats = rankMaterialCandidates(allMaterials, materialIntent, selectedProduct)
            const matchingMats = rankedMats.filter(r => r.score > 0)

            // Strictly bounded to maximum 6 candidates
            materialCandidates = matchingMats.slice(0, 6).map(r => ({
              id: String(r.material.id),
              name: String(r.material.name).slice(0, 200),
              category: r.material.category ? String(r.material.category).slice(0, 100) : null,
              material_type: r.material.materialType ? String(r.material.materialType).slice(0, 150) : null,
              origin: r.material.origin ? String(r.material.origin).slice(0, 150) : null,
              quality: r.material.quality ? String(r.material.quality).slice(0, 100) : null,
              price: r.material.displayPrice ? String(r.material.displayPrice).slice(0, 50) : `₹${r.material.price}`,
              quantity_unit: r.material.quantityUnit ? String(r.material.quantityUnit).slice(0, 50) : null,
              in_stock: Boolean(r.material.inStock),
              description: r.material.description ? String(r.material.description).slice(0, 250) : null,
              denier_or_count: r.material.denierOrCount ? String(r.material.denierOrCount).slice(0, 100) : null,
              supplier_name: r.material.supplier?.name ? String(r.material.supplier.name).slice(0, 150) : null
            }))
          }
        } catch (dbErr) {
          console.warn('Error querying material candidates for AI context:', dbErr.message)
        }
      }

      // Construct sanitized application context
      const sanitizedContext = {
        currentPage: typeof context?.currentPage === 'string' ? context.currentPage.slice(0, 50) : 'assistant',
        userRole,
        selectedProduct,
        selectedArtisan,
        selectedRawMaterial,
        productCandidates: (intent.isRecommendationQuery || intent.isSimilarity) ? productCandidates : undefined,
        materialCandidates: materialIntent.isMaterialQuery ? materialCandidates : undefined,
        userPreferences
      }

      // 6. Send to FastAPI AI Service
      const fastApiUrl = process.env.FASTAPI_SERVICE_URL || 'http://localhost:8000'
      const endpoint = `${fastApiUrl}/api/ai/chat`

      const response = await axios.post(
        endpoint,
        {
          message: message.trim(),
          history: Array.isArray(history) ? history.slice(-10) : [],
          context: sanitizedContext
        },
        {
          timeout: FASTAPI_TIMEOUT,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const aiData = response.data

      if (!aiData || !aiData.success) {
        throw new Error(aiData?.message || 'Failed to get a successful response from AI service')
      }

      return sendSuccess(res, aiData.data, 'AI response generated successfully')

    } catch (error) {
      console.error('Error in AI Chat Controller:', error.message)
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return sendError(res, 'The AI service took too long to respond. Please try again.', 504)
      }
      
      if (error.code === 'ECONNREFUSED') {
        return sendError(res, 'The AI service is currently unavailable. Please try again later.', 503)
      }
      
      if (error.response) {
        const status = error.response.status
        const detail = error.response.data?.detail || 'Error from AI service'
        return sendError(res, detail, status)
      }

      return sendError(res, 'An error occurred while processing your request', 500)
    }
  }
}
