import { api } from './api'
import type { AIWearPreviewInput, AIWearPreviewResult } from '../types/aiPreview'

export async function generateProductWearPreview(
  input: AIWearPreviewInput
): Promise<AIWearPreviewResult> {
  const res = await api.post<AIWearPreviewResult>('/ai/product-preview', input)
  return res.data
}
