import { supabase } from '../lib/supabase'
import { normalizeImageArray } from '../utils/imageUtils'

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

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id
}

async function getCartResponse(userId: string): Promise<CartResponse> {
  const { data: items } = await supabase.from('cart_items').select('quantity, products(*)').eq('user_id', userId)
  if (!items) return { items: [], subtotal: 0, totalCount: 0 }
  
  let subtotal = 0
  let totalCount = 0
  const mappedItems: CartItemDto[] = items.map(item => {
    const p = item.products as unknown as {
      id: string; price: number; name: string; display_price: string; images: string[] | string; technique: string; in_stock: boolean;
    }
    subtotal += (Number(p.price) || 0) * item.quantity
    totalCount += item.quantity
    return {
      productId: p.id,
      quantity: item.quantity,
      name: p.name,
      price: Number(p.price),
      displayPrice: p.display_price,
      image: normalizeImageArray(p.images)[0] || '',
      craft: p.technique,
      inStock: p.in_stock
    }
  })
  
  return { items: mappedItems, subtotal, totalCount }
}

export async function fetchServerCart(): Promise<CartResponse | null> {
  const userId = await getUserId()
  if (!userId) return null
  return getCartResponse(userId)
}

export async function addServerCartItem(productId: string, quantity = 1): Promise<CartResponse | null> {
  const userId = await getUserId()
  if (!userId) return null
  
  const { data: existing } = await supabase.from('cart_items').select('id, quantity').eq('user_id', userId).eq('product_id', productId).single()
  
  if (existing) {
    await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
  } else {
    await supabase.from('cart_items').insert({ user_id: userId, product_id: productId, quantity })
  }
  
  return getCartResponse(userId)
}

export async function updateServerCartQuantity(productId: string, quantity: number): Promise<CartResponse | null> {
  const userId = await getUserId()
  if (!userId) return null
  
  await supabase.from('cart_items').update({ quantity }).eq('user_id', userId).eq('product_id', productId)
  return getCartResponse(userId)
}

export async function removeServerCartItem(productId: string): Promise<CartResponse | null> {
  const userId = await getUserId()
  if (!userId) return null
  
  await supabase.from('cart_items').delete().eq('user_id', userId).eq('product_id', productId)
  return getCartResponse(userId)
}

export async function clearServerCart(): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false
  
  await supabase.from('cart_items').delete().eq('user_id', userId)
  return true
}

export async function syncServerCart(items: Array<{ productId: string; quantity: number }>): Promise<CartResponse | null> {
  const userId = await getUserId()
  if (!userId) return null
  
  for (const item of items) {
    const { data: existing } = await supabase.from('cart_items').select('id, quantity').eq('user_id', userId).eq('product_id', item.productId).single()
    if (!existing) {
      await supabase.from('cart_items').insert({ user_id: userId, product_id: item.productId, quantity: item.quantity })
    }
  }
  return getCartResponse(userId)
}

export async function fetchServerWishlist(): Promise<{ wishlistIds: string[]; products: Record<string, unknown>[] } | null> {
  const userId = await getUserId()
  if (!userId) return null
  
  const { data } = await supabase.from('wishlist_items').select('product_id, products(*)').eq('user_id', userId)
  if (!data) return { wishlistIds: [], products: [] }
  
  return {
    wishlistIds: data.map(d => d.product_id),
    products: data.map(d => d.products as unknown as Record<string, unknown>)
  }
}

export async function toggleServerWishlist(productId: string): Promise<{ inWishlist: boolean; wishlistIds: string[] } | null> {
  const userId = await getUserId()
  if (!userId) return null
  
  const { data: existing } = await supabase.from('wishlist_items').select('id').eq('user_id', userId).eq('product_id', productId).single()
  
  let inWishlist = false
  if (existing) {
    await supabase.from('wishlist_items').delete().eq('id', existing.id)
  } else {
    await supabase.from('wishlist_items').insert({ user_id: userId, product_id: productId })
    inWishlist = true
  }
  
  const { data } = await supabase.from('wishlist_items').select('product_id').eq('user_id', userId)
  return {
    inWishlist,
    wishlistIds: (data || []).map(d => d.product_id)
  }
}
