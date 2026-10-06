import { supabase } from '../lib/supabase'

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
}

export const aiChatService = {
  async sendMessage(payload: ChatRequestPayload): Promise<ChatResponseData> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: payload
      })
      if (error) throw error
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
