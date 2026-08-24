import { useState, useCallback, useEffect } from 'react'

interface CartItem {
  productId: string
  quantity: number
}

const CART_KEY = 'hc-cart'
const WISH_KEY = 'hc-wishlist'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadJson<CartItem[]>(CART_KEY, []))
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadJson<string[]>(WISH_KEY, []))

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cartItems)) }, [cartItems])
  useEffect(() => { localStorage.setItem(WISH_KEY, JSON.stringify(wishlistIds)) }, [wishlistIds])

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === productId)
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { productId, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => i.productId !== productId))
    } else {
      setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i))
    }
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const isInWishlist = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds])
  const isInCart = useCallback((productId: string) => cartItems.some(i => i.productId === productId), [cartItems])
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return {
    cartItems,
    wishlistIds,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    isInCart,
  }
}
