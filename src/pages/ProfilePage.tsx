import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../hooks/useCart'
import { Button } from '../components/primitives/Button'
import { Icon } from '../components/primitives/Icon'
import { getOrders } from '../services/orderService'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { wishlistIds } = useCart()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'addresses' | 'preferences'>('info')

  const userOrders = useMemo(() => getOrders(), [activeTab])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {getInitials(user.fullName)}
                </div>
              )}
              <h3>{user.fullName}</h3>
              <p>Atelier Member since {new Date(user.joinedAt).getFullYear()}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--brand)' }}>
                <Icon name="heart" size={14} /> {wishlistIds.length} Saved Heirlooms
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`profile-nav-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <Icon name="user" size={18} /> Profile Information
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Icon name="bag" size={18} /> Order History
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <Icon name="cube" size={18} /> Saved Addresses
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <Icon name="sparkles" size={18} /> Account Preferences
              </button>
              <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />
              <button className="profile-nav-btn" onClick={handleLogout} style={{ color: '#ff5555' }}>
                <Icon name="close" size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="profile-content">
            {activeTab === 'info' && (
              <section>
                <h2 className="profile-section-title">Profile Information</h2>
                <div className="info-grid">
                  <div className="info-block">
                    <label>Full Name</label>
                    <p>{user.fullName}</p>
                  </div>
                  <div className="info-block">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-block">
                    <label>Member Since</label>
                    <p>{new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <Button variant="secondary">Edit Profile</Button>
              </section>
            )}

            {activeTab === 'orders' && (
              <section>
                <h2 className="profile-section-title">Order History ({userOrders.length})</h2>
                {userOrders.length === 0 ? (
                  <p style={{ color: 'var(--muted)' }}>No orders placed yet.</p>
                ) : (
                  userOrders.map(ord => (
                    <div key={ord.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <div className="order-id">Order #{ord.id}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="order-status processing" style={{ textTransform: 'capitalize' }}>
                          {ord.status.replace(/_/g, ' ')}
                        </div>
                      </div>
                      
                      {ord.items.map(item => (
                        <div key={item.productId} className="order-items" style={{ marginBottom: '12px' }}>
                          <img src={item.image} alt={item.name} className="order-item-img" />
                          <div>
                            <p style={{ fontWeight: 500, margin: '0 0 4px' }}>{item.name}</p>
                            <p style={{ color: 'var(--gold)', fontSize: '0.85rem', margin: '0 0 4px', fontWeight: 600 }}>{item.craft} • {item.artisanName}</p>
                            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Qty: {item.quantity} • ₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}

                      <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                        <Button variant="secondary" onClick={() => navigate(`/order-tracking?id=${ord.id}`)}>
                          🔍 Track Loom Commission
                        </Button>
                        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>
                          Total: ₹{ord.totalAmount.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  ))
                )}
              </section>
            )}

            {activeTab === 'addresses' && (
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-md)' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, margin: 0 }}>Saved Addresses</h2>
                  <Button variant="secondary">Add New</Button>
                </div>
                <div className="address-card">
                  <div className="address-card-header">
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Ananya Collector</h4>
                    <span className="address-type">Default Shipping</span>
                  </div>
                  <div className="address-details">
                    <p>128 Heritage Enclave, Block B<br />
                    Indiranagar, Stage 2<br />
                    Bengaluru, Karnataka 560038<br />
                    India</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer' }}>Edit</button>
                    <button style={{ background: 'none', border: 'none', color: '#ff5555', textDecoration: 'underline', cursor: 'pointer' }}>Remove</button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'preferences' && (
              <section>
                <h2 className="profile-section-title">Account Preferences</h2>
                <div className="auth-form-group" style={{ marginBottom: '24px', maxWidth: '400px' }}>
                  <label>Preferred Currency</label>
                  <select className="auth-input-wrapper" style={{ width: '100%', padding: '12px', background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
                    <option value="INR">₹ INR (Indian Rupee)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                    <option value="EUR">€ EUR (Euro)</option>
                    <option value="GBP">£ GBP (British Pound)</option>
                  </select>
                </div>
                <div className="auth-options" style={{ justifyContent: 'flex-start' }}>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Subscribe to Atelier Newsletter & Craft Journal</span>
                  </label>
                </div>
                <div style={{ marginTop: '32px' }}>
                  <Button variant="primary">Save Preferences</Button>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
