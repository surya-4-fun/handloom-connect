import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../contexts/AuthContext'
import { SHOP_PRODUCTS, getArtisanById } from '../mocks/shopData'
import { DELIVERY_METHODS, createOrder } from '../services/orderService'
import { Address } from '../types/auth'
import { DeliveryMethod, PaymentMethodType, OrderItem } from '../types/order'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Address State
  const [address, setAddress] = useState<Address>({
    id: 'addr-default',
    type: 'shipping',
    fullName: user?.fullName || 'Ananya Collector',
    addressLine1: '128 Heritage Enclave, Block B',
    addressLine2: 'Indiranagar, Stage 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    isDefault: true
  })
  const [addressError, setAddressError] = useState('')

  // Step 2: Delivery Method State
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod>(DELIVERY_METHODS[0])

  // Step 3: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi')
  const [upiId, setUpiId] = useState('ananya@upi')
  const [cardHolder, setCardHolder] = useState(user?.fullName || 'Ananya Collector')
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvv, setCardCvv] = useState('•••')
  const [paymentError, setPaymentError] = useState('')

  // Options
  const [includeGiftBox, setIncludeGiftBox] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hydrate Cart Items into OrderItems
  const orderItems: OrderItem[] = useMemo(() => {
    // If cart is empty in state (e.g., test direct navigation), fallback to mock items for demo preview
    if (cartItems.length === 0) {
      return [
        {
          productId: 'kanchipuram-gold',
          name: 'Royal Kanchipuram Gold Zari Saree',
          price: 24500,
          displayPrice: '₹24,500',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
          craft: 'Kanchipuram Double Warp Korvai',
          artisanName: 'Master Weaver Ramanathan & Family',
          cluster: 'Kanchipuram Cluster, Tamil Nadu'
        }
      ]
    }

    return cartItems.map(item => {
      const found = SHOP_PRODUCTS.find(p => p.id === item.productId || p.slug === item.productId)
      if (found) {
        const artisan = getArtisanById(found.artisanId)
        return {
          productId: found.id,
          name: found.name,
          price: found.price,
          displayPrice: found.displayPrice,
          quantity: item.quantity,
          image: found.images[0],
          craft: found.technique || 'Handloom Weave',
          artisanName: artisan?.name || 'Master Weaver Guild',
          cluster: artisan?.region || found.region || 'India Weaving Cluster'
        }
      }

      // Fallback if custom item
      return {
        productId: item.productId,
        name: 'Handcrafted Heritage Piece',
        price: 18500,
        displayPrice: '₹18,500',
        quantity: item.quantity,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
        craft: 'Traditional Pit Loom Weave',
        artisanName: 'Master Weaver Collective',
        cluster: 'Varanasi, Uttar Pradesh'
      }
    })
  }, [cartItems])

  // Calculations
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const giftBoxFee = includeGiftBox ? 750 : 0
  const shippingFee = selectedDelivery.cost
  const taxFee = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + giftBoxFee + shippingFee + taxFee

  // Step 1 Validation
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
      setAddressError('Please fill in all required address fields.')
      return
    }
    setAddressError('')
    setCurrentStep(2)
  }

  // Step 3 Validation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setPaymentError('Please enter a valid UPI ID (e.g. name@upi).')
      return
    }
    if (paymentMethod === 'card' && (!cardHolder || !cardNumber || !cardExpiry)) {
      setPaymentError('Please complete all card fields.')
      return
    }
    setPaymentError('')
    setCurrentStep(4)
  }

  // Step 4 Order Submission
  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    
    // Simulate brief network delay
    await new Promise(res => setTimeout(res, 800))

    const newOrder = createOrder({
      items: orderItems,
      shippingAddress: address,
      deliveryMethod: selectedDelivery,
      paymentDetails: {
        method: paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) || '4242' : undefined,
        cardHolderName: paymentMethod === 'card' ? cardHolder : undefined
      },
      includeGiftBox
    })

    clearCart()
    setIsSubmitting(false)
    navigate(`/order-confirmation/${newOrder.id}`)
  }

  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Atelier Checkout</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', margin: 0, fontWeight: 400 }}>
            Commission Your Loom Order
          </h1>
        </div>

        {/* Wizard Progress Bar */}
        <div className="checkout-wizard-bar">
          <div className={`wizard-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
            <div className="wizard-step-bubble">{currentStep > 1 ? '✓' : '1'}</div>
            <span className="wizard-step-title">Address</span>
          </div>
          <div className={`wizard-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <div className="wizard-step-bubble">{currentStep > 2 ? '✓' : '2'}</div>
            <span className="wizard-step-title">Delivery</span>
          </div>
          <div className={`wizard-step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
            <div className="wizard-step-bubble">{currentStep > 3 ? '✓' : '3'}</div>
            <span className="wizard-step-title">Payment</span>
          </div>
          <div className={`wizard-step ${currentStep === 4 ? 'active' : ''}`}>
            <div className="wizard-step-bubble">4</div>
            <span className="wizard-step-title">Review</span>
          </div>
        </div>

        {/* Main Checkout Layout */}
        <div className="checkout-grid">
          
          {/* Left Main Form Container */}
          <div className="checkout-panel">
            
            {/* STEP 1: ADDRESS */}
            {currentStep === 1 && (
              <form onSubmit={handleAddressSubmit}>
                <h2 className="checkout-panel-title">1. Delivery Address</h2>
                {addressError && <div className="auth-error" style={{ marginBottom: '16px' }}>{addressError}</div>}

                <div className="auth-form" style={{ gap: '16px' }}>
                  <div className="auth-form-group">
                    <label>Recipient Full Name *</label>
                    <input
                      type="text"
                      className="auth-input-wrapper"
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                      value={address.fullName}
                      onChange={e => setAddress({ ...address, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label>Street Address Line 1 *</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                      value={address.addressLine1}
                      onChange={e => setAddress({ ...address, addressLine1: e.target.value })}
                      placeholder="House No., Building, Street Name"
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label>Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                      value={address.addressLine2 || ''}
                      onChange={e => setAddress({ ...address, addressLine2: e.target.value })}
                      placeholder="Apartment, Suite, Landmark"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="auth-form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                        value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="auth-form-group">
                      <label>PIN / Postal Code *</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                        value={address.postalCode}
                        onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                        value={address.country}
                        onChange={e => setAddress({ ...address, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="primary">
                      Continue to Delivery <Icon name="chevron-right" size={16} />
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {currentStep === 2 && (
              <div>
                <h2 className="checkout-panel-title">2. Choose Delivery Method</h2>
                <div className="delivery-options-grid">
                  {DELIVERY_METHODS.map(method => (
                    <label
                      key={method.id}
                      className={`delivery-card ${selectedDelivery.id === method.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDelivery(method)}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery.id === method.id}
                        onChange={() => setSelectedDelivery(method)}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>{method.name}</strong>
                          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{method.displayCost}</span>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
                          {method.description} • Est: <strong>{method.estimatedDays}</strong>
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                    <Icon name="chevron-left" size={16} /> Back to Address
                  </Button>
                  <Button variant="primary" onClick={() => setCurrentStep(3)}>
                    Continue to Payment <Icon name="chevron-right" size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <form onSubmit={handlePaymentSubmit}>
                <h2 className="checkout-panel-title">3. Safe Mock Payment</h2>
                {paymentError && <div className="auth-error" style={{ marginBottom: '16px' }}>{paymentError}</div>}

                {/* Safe Prototype Notice */}
                <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '20px', fontSize: '0.88rem', color: 'var(--ink)' }}>
                  🛡️ <strong>Prototype Simulation:</strong> No real money will be charged. Choose any mock payment method below to test order commission.
                </div>

                <div className="payment-tabs">
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    ⚡ Instant UPI
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    💳 Card (Mock)
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    📦 Cash / UPI on Delivery
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="auth-form-group">
                    <label>Enter Mock UPI ID *</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. user@upi or name@okaxis"
                      required
                    />
                    <small style={{ color: 'var(--muted)', marginTop: '4px' }}>Supports Google Pay, PhonePe, Paytm & BHIM mock authorization.</small>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="auth-form" style={{ gap: '16px' }}>
                    <div className="auth-form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        required
                      />
                    </div>
                    <div className="auth-form-group">
                      <label>Card Number (Prototype Input) *</label>
                      <input
                        type="text"
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="auth-form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="auth-form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          style={{ width: '100%', padding: '12px 16px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div style={{ background: 'var(--canvas)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                    <span style={{ display: 'inline-block', marginBottom: '8px', color: 'var(--gold)' }}><Icon name="cube" size={32} /></span>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Pay upon loom completion during insured express delivery.</p>
                  </div>
                )}

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                    <Icon name="chevron-left" size={16} /> Back to Delivery
                  </Button>
                  <Button type="submit" variant="primary">
                    Review Order <Icon name="chevron-right" size={16} />
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 4: ORDER REVIEW */}
            {currentStep === 4 && (
              <div>
                <h2 className="checkout-panel-title">4. Review & Confirm Commission</h2>

                {/* Items Summary */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '12px' }}>Handloom Items</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orderItems.map(item => (
                      <div key={item.productId} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div style={{ flexGrow: 1 }}>
                          <strong style={{ fontSize: '1rem', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{item.craft} • By {item.artisanName}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'block' }}>Qty: {item.quantity}</span>
                          <strong style={{ color: 'var(--gold)' }}>₹{(item.price * item.quantity).toLocaleString()}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                    <h5 style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Delivery To</h5>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{address.fullName}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>{address.addressLine1}, {address.city}, {address.state} - {address.postalCode}</p>
                  </div>
                  <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                    <h5 style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Payment & Shipping</h5>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{selectedDelivery.name}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
                      Method: <strong style={{ textTransform: 'uppercase' }}>{paymentMethod}</strong> ({paymentMethod === 'upi' ? upiId : paymentMethod === 'card' ? `•••• ${cardNumber.slice(-4)}` : 'Cash on Delivery'})
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="secondary" onClick={() => setCurrentStep(3)}>
                    <Icon name="chevron-left" size={16} /> Back to Payment
                  </Button>
                  <Button variant="primary" onClick={handlePlaceOrder} disabled={isSubmitting}>
                    {isSubmitting ? 'Commissioning Loom...' : `Place Loom Order • ₹${grandTotal.toLocaleString()}`}
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sidebar */}
          <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              Summary & Fees
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({orderItems.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Handloom GST (5%)</span>
                <span>₹{taxFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Transit</span>
                <span>{selectedDelivery.cost === 0 ? 'FREE' : `₹${selectedDelivery.cost}`}</span>
              </div>

              {/* Gift Box Checkbox */}
              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                <label className="checkbox-label" style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>
                  <input
                    type="checkbox"
                    checked={includeGiftBox}
                    onChange={e => setIncludeGiftBox(e.target.checked)}
                  />
                  <span>Signature Wood Gift Box (+₹750)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Grand Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', fontWeight: 600 }}>
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--canvas)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
              🎖️ <strong>100% Direct Artisan Guarantee:</strong> Your purchase directly supports master weavers in verified Indian clusters.
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
