import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function CartWishlistPage({ type }: { type: 'cart' | 'wishlist' }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([
    {
      id: '1',
      title: 'Banarasi Real Zari Katan Silk Saree',
      craft: 'Varanasi Brocade',
      price: 48500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
      qty: 1
    },
    {
      id: '2',
      title: 'Kanchipuram Temple Border Korvai Silk',
      craft: 'Kanchipuram Silk',
      price: 39200,
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop',
      qty: 1
    }
  ])
  const [giftBox, setGiftBox] = useState(true)

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0) + (giftBox ? 750 : 0)

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="cart-wishlist-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Atelier Orders</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400 }}>
            {type === 'cart' ? 'Your Atelier Cart' : 'Saved Heirlooms Wishlist'}
          </h1>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--canvas-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--muted)', marginBottom: '16px' }}>Your {type} is currently empty</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Discover authentic handloom pieces woven by master Indian weavers.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '20px', background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.craft}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink)', margin: '4px 0 8px' }}>{item.title}</h3>
                    <strong style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>₹{item.price.toLocaleString()}</strong>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--muted)' }}>
                <span>Subtotal</span>
                <span>₹{items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={giftBox} onChange={e => setGiftBox(e.target.checked)} />
                  Signature Wood Gift Box (+₹750)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--ink)' }}>Total</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>₹{total.toLocaleString()}</span>
              </div>

              <button className="button button--primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
                Proceed to Secure Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
