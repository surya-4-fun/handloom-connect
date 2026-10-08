import { supabaseUrl, supabaseKey } from '../lib/supabase'

export interface ProductRecommendation {
  id?: string;
  productId?: string;
  title: string;
  craft: string;
  price: string;
  category?: string;
  reason?: string;
}

export interface MaterialRecommendation {
  id?: string;
  name: string;
  category?: string;
  price: string;
  unit?: string;
  origin?: string;
  reason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: ProductRecommendation[];
  materialSuggestions?: MaterialRecommendation[];
}

export interface ClientAIContext {
  currentPage?: string;
  productId?: string;
  artisanId?: string;
  rawMaterialId?: string;
  productCandidates?: Array<{
    id: string;
    name: string;
    craft?: string;
    price?: string;
    region?: string;
  }>;
  materialCandidates?: Array<{
    id: string;
    name: string;
    category?: string;
    price?: string;
  }>;
  [key: string]: unknown;
}

export interface ChatRequestPayload {
  message: string;
  history?: { sender: string; text: string }[];
  context?: ClientAIContext;
}

export interface ChatResponseData {
  reply: string;
  suggestions?: ProductRecommendation[];
  materialSuggestions?: MaterialRecommendation[];
  provider?: string;
  model?: string;
}

export interface SendMessageOptions {
  onDelta?: (accumulatedText: string, chunkText: string) => void;
  signal?: AbortSignal;
}

export const aiChatService = {
  async sendMessage(
    payload: ChatRequestPayload,
    options?: SendMessageOptions
  ): Promise<ChatResponseData> {
    try {
      // Limit history to the most recent 6 messages to avoid sending excessive network payloads
      const sanitizedPayload: ChatRequestPayload = {
        ...payload,
        history: payload.history ? payload.history.slice(-6) : undefined
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(sanitizedPayload),
        signal: options?.signal
      })

      if (!res.ok) {
        throw new Error(`AI service returned HTTP ${res.status}`)
      }

      const contentType = res.headers.get('content-type') || ''

      // 1. Handle Server-Sent Events (SSE) Stream
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let accumulatedText = ''
        let finalResponse: ChatResponseData = {
          reply: '',
          suggestions: []
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data:')) continue

              const dataStr = trimmed.slice(5).trim()
              if (dataStr === '[DONE]') continue

              try {
                const event = JSON.parse(dataStr)
                if (event.type === 'delta' && typeof event.text === 'string') {
                  accumulatedText += event.text
                  options?.onDelta?.(accumulatedText, event.text)
                } else if (event.type === 'done') {
                  finalResponse = {
                    reply: event.reply || accumulatedText,
                    suggestions: event.suggestions || [],
                    materialSuggestions: event.materialSuggestions || [],
                    provider: event.provider,
                    model: event.model
                  }
                }
              } catch {
                // Ignore malformed chunk line
              }
            }
          }

          if (buffer.trim().startsWith('data:')) {
            const dataStr = buffer.trim().slice(5).trim()
            if (dataStr !== '[DONE]') {
              try {
                const event = JSON.parse(dataStr)
                if (event.type === 'delta' && typeof event.text === 'string') {
                  accumulatedText += event.text
                  options?.onDelta?.(accumulatedText, event.text)
                } else if (event.type === 'done') {
                  finalResponse = {
                    reply: event.reply || accumulatedText,
                    suggestions: event.suggestions || [],
                    materialSuggestions: event.materialSuggestions || [],
                    provider: event.provider,
                    model: event.model
                  }
                }
              } catch {
                // Ignore
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

        if (!finalResponse.reply && accumulatedText) {
          finalResponse.reply = accumulatedText
        }

        return finalResponse
      }

      // 2. Handle Non-Streaming JSON Response (e.g. Greeting Fast-path, Domain Fallback)
      const data: ChatResponseData = await res.json()
      if (data.reply) {
        options?.onDelta?.(data.reply, data.reply)
      }
      return data
    } catch (err: unknown) {
      console.warn('AI Edge Function failed, falling back to mock response', err)
      return {
        reply: "Hello! I am currently in offline/mock mode. Once the 'ai-chat' Edge Function is deployed with AI keys, I'll be able to assist you fully with styling and recommendations.",
        suggestions: []
      }
    }
  }
};
