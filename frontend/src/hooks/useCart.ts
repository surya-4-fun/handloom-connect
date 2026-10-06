import { useState, useCallback, useEffect } from 'react'
import {
  fetchServerCart,
  addServerCartItem,
  updateServerCartQuantity,
  removeServerCartItem,
  clearServerCart,
  fetchServerWishlist,
  toggleServerWishlist,
} from '../services/cartService'
import { supabase } from '../lib/supabase'

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

  // Sync with server if token is present
  useEffect(() => {
    let isMounted = true
    const initServerSync = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return
      try {
        const [serverCart, serverWishlist] = await Promise.all([
          fetchServerCart(),
          fetchServerWishlist()
        ])

        if (isMounted) {
          if (serverCart && serverCart.items?.length) {
            setCartItems(serverCart.items.map(i => ({ productId: i.productId, quantity: i.quantity })))
          }
          if (serverWishlist && serverWishlist.wishlistIds?.length) {
            setWishlistIds(serverWishlist.wishlistIds)
          }
        }
      } catch {
        // Fallback to local
      }
    }

    initServerSync()
    return () => { isMounted = false }
  }, [])

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      addServerCartItem(productId, quantity).then(res => {
        if (res && res.items) {
          setCartItems(res.items.map(i => ({ productId: i.productId, quantity: i.quantity })))
        }
      }).catch(() => {})
    } else {
      setCartItems(prev => {
        const existing = prev.find(i => i.productId === productId)
        if (existing) {
          return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i)
        }
        return [...prev, { productId, quantity }]
      })
    }
  }, [])

  const removeFromCart = useCallback(async (productId: string) => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      removeServerCartItem(productId).then(res => {
        if (res && res.items) {
          setCartItems(res.items.map(i => ({ productId: i.productId, quantity: i.quantity })))
        }
      }).catch(() => {})
    } else {
      setCartItems(prev => prev.filter(i => i.productId !== productId))
    }
  }, [])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      if (quantity <= 0) {
        removeServerCartItem(productId).then(res => {
          if (res && res.items) setCartItems(res.items.map(i => ({ productId: i.productId, quantity: i.quantity })))
        }).catch(() => {})
      } else {
        updateServerCartQuantity(productId, quantity).then(res => {
          if (res && res.items) setCartItems(res.items.map(i => ({ productId: i.productId, quantity: i.quantity })))
        }).catch(() => {})
      }
    } else {
      if (quantity <= 0) {
        setCartItems(prev => prev.filter(i => i.productId !== productId))
      } else {
        setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i))
      }
    }
  }, [])

  const toggleWishlist = useCallback(async (productId: string) => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      toggleServerWishlist(productId).then(res => {
        if (res && res.wishlistIds) {
          setWishlistIds(res.wishlistIds)
        }
      }).catch(() => {})
    } else {
      setWishlistIds(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      )
    }
  }, [])

  const clearCart = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      clearServerCart().then(() => {
        setCartItems([])
      }).catch(() => {})
    } else {
      setCartItems([])
    }
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

