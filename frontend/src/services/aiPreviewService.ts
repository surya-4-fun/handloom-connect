import { supabase } from '../lib/supabase'
import type { AIWearPreviewInput, AIWearPreviewResult } from '../types/aiPreview'

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
    return {
      previewUrl: '', // Just return empty or a placeholder in mock mode
      disclaimer: 'Mock Mode',
      isMock: true,
      product: {
        id: input.productId,
        name: 'Mock Product',
        category: 'Mock Category',
        image: '',
        craft: 'Mock Craft'
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
