import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { getOrderById } from '../services/orderService'

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const order = orderId ? getOrderById(orderId) : undefined

  if (!order) {
    return (
      <div className="confirmation-page" style={{ textAlign: 'center' }}>
        <div className="container" style={{ padding: '80px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '16px' }}>Order Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>We could not locate details for Order ID: {orderId}</p>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        
        <div className="confirmation-card">
          
          {/* Hero Banner */}
          <div className="confirmation-hero">
            <div className="confirmation-hero-badge">
              ✓
            </div>
            <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Commission Confirmed</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '8px 0 12px', fontWeight: 400 }}>
              Your Handloom Loom Order Has Been Placed!
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: '560px', margin: '0 auto 16px', fontSize: '1rem', lineHeight: 1.6 }}>
              Thank you for supporting authentic handloom heritage. Master weavers are now setting the warp threads for your loom commission.
            </p>

            <div style={{ display: 'inline-block', background: 'var(--canvas)', border: '1px border var(--border)', borderRadius: '100px', padding: '8px 24px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em' }}>
              ORDER ID: {order.id}
            </div>
          </div>

          {/* Details & Items Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '32px' }}>
            
            {/* Left: Purchased Items */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                Commissioned Textiles ({order.items.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {order.items.map(item => (
                  <div key={item.productId} style={{ display: 'flex', gap: '16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ fontSize: '1.05rem', display: 'block', color: 'var(--ink)' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>{item.craft}</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '2px 0 0' }}>Maker: {item.artisanName} • {item.cluster}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Qty: {item.quantity}</span>
                      <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '1.1rem' }}>₹{(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary Card */}
            <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Est. Delivery Date:</span>
                  <strong style={{ color: 'var(--gold)' }}>{order.estimatedDelivery}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping Address:</span>
                  <span style={{ textAlign: 'right', color: 'var(--ink)' }}>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Speed:</span>
                  <span style={{ color: 'var(--ink)' }}>{order.deliveryMethod.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment Method:</span>
                  <span style={{ textTransform: 'uppercase', color: 'var(--ink)', fontWeight: 600 }}>{order.paymentDetails.method}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)', fontWeight: 700, fontSize: '1.2rem' }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <Button variant="primary" onClick={() => navigate(`/order-tracking?id=${order.id}`)}>
              🔍 Track Loom Commission Progress
            </Button>
            <Button variant="secondary" onClick={() => navigate('/profile')}>
              <Icon name="user" size={16} /> View in Profile
            </Button>
            <Link to="/marketplace" className="button button--secondary">
              Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
