/**
 * AI Wear Preview Image Service
 * 
 * Generates an AI-based reference visualization showing a selected handcrafted handloom
 * product being worn, using user-provided physical reference attributes (height, weight, body shape)
 * while strictly preserving the authentic garment's color, pattern, border, motifs, and texture.
 * 
 * Supports real AI providers (Google Gemini Imagen 3, Stability AI, OpenAI DALL-E, Replicate)
 * with an isolated, robust mock / development fallback mode.
 */

const DISCLAIMER_TEXT =
  'AI-generated reference. Results may differ from real-world fit, proportions, draping, lighting, and garment appearance.'

/**
 * Curated wear visualization references by product craft/category for mock/development mode.
 * Preserves the visual identity of handloom garments when worn by real humans.
 */
const WEAR_PREVIEW_ASSETS = {
  sarees: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop'
  ],
  stoles: [
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop'
  ],
  shawls: [
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop'
  ],
  fabrics: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop'
  ],
  dupattas: [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop'
  ]
}

/**
 * Builds a prompt emphasizing strict garment preservation and neutral body reference.
 */
function buildWearPrompt({ product, height, weight, bodyShape, referenceImage }) {
  const shapeDesc = {
    balanced: 'balanced proportions',
    petite: 'petite frame',
    athletic: 'athletic posture',
    curvy: 'curved silhouette',
    tall_slender: 'tall slender proportions',
    unspecified: 'natural elegant drape'
  }[bodyShape] || 'natural elegant drape'

  return [
    `Editorial fashion reference photograph of a person (height approx ${height}cm, weight approx ${weight}kg, ${shapeDesc}) wearing the exact handcrafted Indian handloom garment titled "${product.name}".`,
    `CRITICAL GARMENT FIDELITY: Strictly preserve the original product design, textile colors, warp/weft interlock, border motifs, pallu detailing, and metallic zari embellishments shown in reference image (${referenceImage}).`,
    `Textile details: authentic handspun ${product.material}, crafted using ${product.technique} from ${product.region}.`,
    `Draping: Traditional, authentic handloom draping with natural fabric gravity and soft folds.`,
    `Setting: Minimalist, warm ambient atelier studio lighting with neutral artisan background, high resolution, 8k photographic clarity.`
  ].join(' ')
}

export const aiImageService = {
  /**
   * Generates an AI wear preview reference image for a product given user body measurements.
   * 
   * @param {Object} params
   * @param {Object} params.product - Product object from DB
   * @param {number} params.height - User height in cm
   * @param {number} params.weight - User weight in kg
   * @param {string} [params.bodyShape] - Optional body shape tag
   * @returns {Promise<{ previewUrl: string, disclaimer: string, promptUsed: string, isMock: boolean, provider: string }>}
   */
  async generateWearPreview({ product, height, weight, bodyShape = 'balanced' }) {
    const mode = (process.env.AI_PREVIEW_MODE || 'mock').toLowerCase()
    const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase()
    const apiKey = process.env.AI_API_KEY || ''

    // Reference image from product
    const images = Array.isArray(product.images)
      ? product.images
      : typeof product.images === 'string'
      ? JSON.parse(product.images)
      : []
    const referenceImage = images[0] || ''

    // Structured prompt for garment preservation
    const promptUsed = buildWearPrompt({
      product,
      height,
      weight,
      bodyShape,
      referenceImage
    })

    // Real AI Provider Integration (active when mode is 'real' and API key is provided)
    if (mode === 'real' && apiKey && provider !== 'mock') {
      try {
        // 1. Google Gemini Imagen 3 Provider
        if (provider === 'gemini_imagen' || provider === 'google' || provider === 'imagen') {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt: promptUsed }],
              parameters: {
                sampleCount: 1,
                aspectRatio: '3:4',
                outputMimeType: 'image/jpeg'
              }
            }),
            signal: AbortSignal.timeout(25000)
          })

          if (response.ok) {
            const data = await response.json()
            if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
              return {
                previewUrl: `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`,
                disclaimer: DISCLAIMER_TEXT,
                promptUsed,
                isMock: false,
                provider: 'Google Imagen 3'
              }
            }
          } else {
            const errText = await response.text()
            console.warn(`[AI Service] Gemini Imagen API response ${response.status}:`, errText)
          }
        }

        // 2. Stability AI Provider
        else if (provider === 'stability' || provider === 'stability_ai') {
          const endpoint = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              text_prompts: [
                { text: promptUsed, weight: 1 },
                { text: 'blurry, disfigured, inaccurate weave, synthetic modern dress, ugly', weight: -1 }
              ],
              cfg_scale: 7,
              height: 1024,
              width: 768,
              samples: 1,
              steps: 30
            }),
            signal: AbortSignal.timeout(25000)
          })

          if (response.ok) {
            const data = await response.json()
            if (data.artifacts && data.artifacts[0]?.base64) {
              return {
                previewUrl: `data:image/png;base64,${data.artifacts[0].base64}`,
                disclaimer: DISCLAIMER_TEXT,
                promptUsed,
                isMock: false,
                provider: 'Stability AI SDXL'
              }
            }
          } else {
            const errText = await response.text()
            console.warn(`[AI Service] Stability AI API response ${response.status}:`, errText)
          }
        }

        // 3. OpenAI DALL-E 3 Provider
        else if (provider === 'openai' || provider === 'dalle3') {
          const endpoint = 'https://api.openai.com/v1/images/generations'
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: promptUsed,
              n: 1,
              size: '1024x1024',
              quality: 'standard'
            }),
            signal: AbortSignal.timeout(25000)
          })

          if (response.ok) {
            const data = await response.json()
            if (data.data && data.data[0]?.url) {
              return {
                previewUrl: data.data[0].url,
                disclaimer: DISCLAIMER_TEXT,
                promptUsed,
                isMock: false,
                provider: 'OpenAI DALL-E 3'
              }
            }
          } else {
            const errText = await response.text()
            console.warn(`[AI Service] OpenAI API response ${response.status}:`, errText)
          }
        }
      } catch (err) {
        console.warn(`[AI Service] Real AI provider (${provider}) execution failed or timed out:`, err.message)
      }
    }

    // High-Fidelity Development / Mock preview selection
    // Selects the closest matching styled garment photograph from the product's actual images or curated craft assets
    const categoryKey = (product.category_id || product.category || 'sarees').toLowerCase()
    const categoryAssets = WEAR_PREVIEW_ASSETS[categoryKey] || WEAR_PREVIEW_ASSETS.sarees

    let previewUrl = referenceImage
    if (images.length > 1) {
      previewUrl = images[1] // on-model / draped shot from product images
    } else if (categoryAssets.length > 0) {
      const hash = (product.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      previewUrl = categoryAssets[hash % categoryAssets.length] || referenceImage
    }

    return {
      previewUrl,
      disclaimer: DISCLAIMER_TEXT,
      promptUsed,
      isMock: true,
      provider: 'Handloom Atelier Development Engine (Mock Mode)'
    }
  }
}
