import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { fetchProductDetail } from '../services/productService'
import { Button } from '../components/primitives/Button'
import { Icon } from '../components/primitives/Icon'

export function CartWishlistPage({ type }: { type: 'cart' | 'wishlist' }) {
  const navigate = useNavigate()
  const { cartItems, wishlistIds, removeFromCart, updateQuantity, toggleWishlist, addToCart } = useCart()
  const [giftBox, setGiftBox] = useState(true)

  const [displayItems, setDisplayItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const hydrate = async () => {
      setIsLoading(true)
      try {
        const ids = type === 'cart' ? cartItems.map(c => c.productId) : wishlistIds
        const hydrated = await Promise.all(
          ids.map(async (id) => {
            const detail = await fetchProductDetail(id)
            const prod = detail?.product
            const artisan = detail?.artisan
            const qty = type === 'cart' ? (cartItems.find(c => c.productId === id)?.quantity || 1) : 1
            return {
              id: id,
              title: prod?.name || 'Handloom Textile Piece',
              craft: prod?.technique || artisan?.craft || 'Traditional Weave',
              price: prod?.price || 18500,
              image: prod?.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
              qty,
              slug: prod?.slug || id
            }
          })
        )
        if (isMounted) setDisplayItems(hydrated)
      } catch (err) {
        console.error('Error hydrating cart/wishlist', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    hydrate()
    return () => { isMounted = false }
  }, [type, cartItems, wishlistIds])


  const subtotal = displayItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total = subtotal + (type === 'cart' && giftBox && displayItems.length > 0 ? 750 : 0)

  return (
    <div className="cart-wishlist-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Atelier Orders</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400 }}>
            {type === 'cart' ? 'Your Atelier Cart' : 'Saved Heirlooms Wishlist'}
          </h1>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--muted)' }}>Loading items...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--canvas-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--muted)', marginBottom: '16px' }}>Your {type} is currently empty</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Discover authentic handloom pieces woven by master Indian weavers.</p>
            <Button variant="primary" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {displayItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '20px', background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', alignItems: 'center' }}>
                  <Link to={`/marketplace/${item.slug}`}>
                    <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  </Link>
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.craft}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink)', margin: '4px 0 8px' }}>
                      <Link to={`/marketplace/${item.slug}`} style={{ color: 'var(--ink)' }}>{item.title}</Link>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <strong style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>₹{item.price.toLocaleString()}</strong>
                      
                      {type === 'cart' && (
                        <div className="qty-selector" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                          <button
                            className="qty-selector__btn"
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Icon name="minus" size={12} />
                          </button>
                          <span className="qty-selector__value">{item.qty}</span>
                          <button
                            className="qty-selector__btn"
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            <Icon name="plus" size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {type === 'wishlist' && (
                    <Button variant="secondary" onClick={() => addToCart(item.id, 1)} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                      Add to Cart
                    </Button>
                  )}

                  <button 
                    onClick={() => type === 'cart' ? removeFromCart(item.id) : toggleWishlist(item.id)} 
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px', padding: '4px 8px' }}
                    aria-label={`Remove ${item.title}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                {type === 'cart' ? 'Order Summary' : 'Wishlist Summary'}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--muted)' }}>
                <span>{type === 'cart' ? 'Cart Subtotal' : 'Total Value'}</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {type === 'cart' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={giftBox} onChange={e => setGiftBox(e.target.checked)} />
                    Signature Wood Gift Box (+₹750)
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--ink)' }}>Total</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>₹{total.toLocaleString()}</span>
              </div>

              {type === 'cart' ? (
                <button className="button button--primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
                  Proceed to Secure Checkout
                </button>
              ) : (
                <Button variant="primary" style={{ width: '100%' }} onClick={() => {
                  displayItems.forEach(i => addToCart(i.id, 1))
                  navigate('/cart')
                }}>
                  Move All to Cart
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
