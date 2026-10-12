import { supabase } from '../lib/supabase'
import type { AIWearPreviewInput, AIWearPreviewResult } from '../types/aiPreview'
import { getAuthoritativeProductImages } from '../utils/imageUtils'

export async function generateProductWearPreview(
  input: AIWearPreviewInput
): Promise<AIWearPreviewResult> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-product-preview', {
      body: input
    })
    if (error) throw error
    return data
  } catch (err: unknown) {
    console.warn('AI Edge Function failed, falling back to mock response', err)
    const verified = getAuthoritativeProductImages(input.productId)
    const primaryImg = verified[0] || ''
    return {
      previewUrl: primaryImg,
      disclaimer: 'Artisanal visual drape estimation based on authentic product geometry.',
      isMock: true,
      product: {
        id: input.productId,
        name: 'Handcrafted Creation',
        category: 'Handloom',
        image: primaryImg,
        craft: 'Handwoven'
      },
      attributes: {
        height: input.height,
        weight: input.weight,
        bodyShape: input.bodyShape || 'unspecified'
      },
      createdAt: new Date().toISOString()
    }
  }
}
