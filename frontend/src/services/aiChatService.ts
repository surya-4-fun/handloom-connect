import api from './api';

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
  [key: string]: any;
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

export interface ChatResponse {
  success: boolean;
  message: string;
  data: ChatResponseData;
}

export const aiChatService = {
  /**
   * Send a chat message to the AI service with optional context
   */
  async sendMessage(payload: ChatRequestPayload): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/ai/chat', payload);
    return response.data;
  }
};
