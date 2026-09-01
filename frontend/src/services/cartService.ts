import { api } from './api'

export interface CartItemDto {
  productId: string
  quantity: number
  name?: string
  price?: number
  displayPrice?: string
  image?: string
  craft?: string
  artisanName?: string
  cluster?: string
  inStock?: boolean
}

export interface CartResponse {
  items: CartItemDto[]
  subtotal: number
  totalCount: number
}

export async function fetchServerCart(): Promise<CartResponse | null> {
  try {
    const res = await api.get<CartResponse>('/cart')
    return res.data
  } catch {
    return null
  }
}

export async function addServerCartItem(productId: string, quantity = 1): Promise<CartResponse | null> {
  try {
    const res = await api.post<CartResponse>('/cart/items', { productId, quantity })
    return res.data
  } catch {
    return null
  }
}

export async function updateServerCartQuantity(productId: string, quantity: number): Promise<CartResponse | null> {
  try {
    const res = await api.put<CartResponse>(`/cart/items/${productId}`, { quantity })
    return res.data
  } catch {
    return null
  }
}

export async function removeServerCartItem(productId: string): Promise<CartResponse | null> {
  try {
    const res = await api.delete<CartResponse>(`/cart/items/${productId}`)
    return res.data
  } catch {
    return null
  }
}

export async function clearServerCart(): Promise<boolean> {
  try {
    await api.delete('/cart')
    return true
  } catch {
    return false
  }
}

export async function syncServerCart(items: Array<{ productId: string; quantity: number }>): Promise<CartResponse | null> {
  try {
    const res = await api.post<CartResponse>('/cart/sync', { items })
    return res.data
  } catch {
    return null
  }
}

export async function fetchServerWishlist(): Promise<{ wishlistIds: string[]; products: any[] } | null> {
  try {
    const res = await api.get<{ wishlistIds: string[]; products: any[] }>('/wishlist')
    return res.data
  } catch {
    return null
  }
}

export async function toggleServerWishlist(productId: string): Promise<{ inWishlist: boolean; wishlistIds: string[] } | null> {
  try {
    const res = await api.post<{ inWishlist: boolean; wishlistIds: string[] }>('/wishlist/toggle', { productId })
    return res.data
  } catch {
    return null
  }
}
