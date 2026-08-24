import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '../components/primitives/Icon'
import { Button } from '../components/primitives/Button'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to where user came from, or profile
  const from = location.state?.from?.pathname || '/profile'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>Welcome back</h1>
          <p>Sign in to access your atelier heirlooms</p>
          <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            • Prototype Session (Local Simulation) •
          </span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-form-group">
            <label htmlFor="email">Email address</label>
            <div className="auth-input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="password">Password</label>
              <Link to="/login" className="auth-link" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'close' : 'sparkles'} size={18} />
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  )
}
