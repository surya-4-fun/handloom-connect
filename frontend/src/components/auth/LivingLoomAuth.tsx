import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../primitives/Icon'
import { LivingLoomCanvas } from './LivingLoomCanvas'
import handloomEmblem from '../../assets/images/handloom-logo-emblem.png'
import '../../styles/living-loom.css'

interface LivingLoomAuthProps {
  initialMode?: 'login' | 'register'
}

type AuthMode = 'login' | 'register' | 'forgot-password'

export function LivingLoomAuth({ initialMode = 'login' }: LivingLoomAuthProps) {
  const { login, register, resetPassword, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine starting mode
  const getModeFromLocation = (): AuthMode => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      return 'register'
    }
    return initialMode
  }

  const [mode, setMode] = useState<AuthMode>(getModeFromLocation())

  // Keep mode in sync if user navigates back/forward via browser history
  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setMode('register')
    } else if (location.pathname === '/login') {
      setMode(prev => (prev === 'forgot-password' ? 'forgot-password' : 'login'))
    }
  }, [location.pathname])

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem('hc_remembered_email') || '')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginShowPassword, setLoginShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('hc_remembered_email')))

  // Form states - Register
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regShowPassword, setRegShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Form states - Forgot Password
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  // Feedback notifications
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Return redirect destination
  const from = location.state?.from?.pathname || '/profile'

  // Smooth mode switching without unmounting route or jumping to footer
  const handleModeChange = (newMode: AuthMode) => {
    setErrorMessage('')
    setSuccessMessage('')
    setMode(newMode)

    // Update browser address bar cleanly without triggering React Router route remount
    const targetUrl = newMode === 'register' ? '/register' : '/login'
    if (window.location.pathname !== targetUrl) {
      window.history.replaceState(null, '', targetUrl)
    }
  }

  // Handle Sign In submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const cleanEmail = loginEmail.trim()
    if (!cleanEmail || !loginPassword) {
      setErrorMessage('Please provide both your registered email and password.')
      return
    }

    try {
      if (rememberMe) {
        localStorage.setItem('hc_remembered_email', cleanEmail)
      } else {
        localStorage.removeItem('hc_remembered_email')
      }

      await login({ email: cleanEmail, password: loginPassword })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.'
      setErrorMessage(msg)
    }
  }

  // Handle Account Creation submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const cleanName = regFullName.trim()
    const cleanEmail = regEmail.trim()

    if (!cleanName || !cleanEmail || !regPassword || !regConfirmPassword) {
      setErrorMessage('Please complete all fields to join the Atelier.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entry.')
      return
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.')
      return
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service and Artisan Heritage Charter.')
      return
    }

    try {
      await register({
        fullName: cleanName,
        email: cleanEmail,
        password: regPassword,
        acceptTerms
      })
      navigate('/profile', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try with another email.'
      setErrorMessage(msg)
    }
  }

  // Handle Password Reset submission
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const cleanEmail = resetEmail.trim()
    if (!cleanEmail) {
      setErrorMessage('Please enter the email associated with your atelier account.')
      return
    }

    try {
      await resetPassword(cleanEmail)
      setResetSent(true)
      setSuccessMessage(`A password recovery link has been dispatched to ${cleanEmail}. Please inspect your inbox.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to dispatch recovery link. Please try again.'
      setErrorMessage(msg)
    }
  }


  return (
    <div className="living-loom-page" role="region" aria-label="Handloom Connect Atelier Authentication">
      {/* 1. Real-time 3D Flowing Silk & Golden Motes Canvas */}
      <LivingLoomCanvas />

      {/* 2. Atmospheric Depth Vignette */}
      <div className="living-loom-vignette" />

      {/* 3. Primary Composition Layout */}
      <div className="living-loom-container">
        {/* Left Column: Brand Storytelling & Living Loom Narrative */}
        <div className="living-loom-story">
          <div className="living-loom-badge">
            <img
              src={handloomEmblem}
              alt="Handloom Connect Emblem"
              className="living-loom-badge__emblem"
            />
            <span className="living-loom-badge__text">The Living Loom Atelier</span>
          </div>

          <h1 className="living-loom-heading">
            Where Heritage <br />
            <em>Meets Tomorrow.</em>
          </h1>

          <p className="living-loom-narrative">
            Discover extraordinary handloom creations, connect with master artisans,
            and explore the stories woven into every thread.
          </p>

          <div className="living-loom-pillars">
            <div className="living-loom-pillar-item">
              <span className="living-loom-pillar-dot" />
              <span>500+ Master Weavers across 18 Heritage Clusters</span>
            </div>
            <div className="living-loom-pillar-item">
              <span className="living-loom-pillar-dot" />
              <span>100% Certified Authentic GI-Tagged Silks & Cottons</span>
            </div>
            <div className="living-loom-pillar-item">
              <span className="living-loom-pillar-dot" />
              <span>Direct Weaver-to-Patron Royalties with Zero Middlemen</span>
            </div>
          </div>

          <div className="living-loom-quote-box">
            <p className="living-loom-quote-text">
              &ldquo;Every warp and weft holds three thousand years of memory, woven by hand, thread by thread.&rdquo;
            </p>
            <p className="living-loom-quote-author">Master Artisan Devendra Rao &bull; Kanjeevaram Guild</p>
          </div>
        </div>

        {/* Right Column: The Restrained Glassmorphism Login Panel */}
        <div className="living-loom-card">
          {/* Mobile & Tablet Brand Header */}
          <header className="living-loom-card__header">
            <Link to="/" className="living-loom-mobile-brand" title="Return to Atelier Gallery">
              <img
                src={handloomEmblem}
                alt="Handloom Connect Emblem"
                className="living-loom-mobile-brand__emblem"
              />
            </Link>
            <h2 className="living-loom-card__title">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Join the Atelier'}
              {mode === 'forgot-password' && 'Account Recovery'}
            </h2>
            <p className="living-loom-card__subtitle">
              {mode === 'login' && 'Sign in to access your curated heirlooms, orders, and artisan connections.'}
              {mode === 'register' && 'Create your patron profile to support master weavers and collect rare handlooms.'}
              {mode === 'forgot-password' && 'Enter your verified email to receive instructions to reset your atelier password.'}
            </p>
          </header>

          {/* Segmented Mode Tabs (Only when not recovering password) */}
          {mode !== 'forgot-password' && (
            <nav className="living-loom-tabs" role="tablist" aria-label="Authentication modes">
              <button
                type="button"
                id="tab-signin"
                role="tab"
                aria-selected={mode === 'login'}
                aria-controls="panel-signin"
                className={`living-loom-tab ${mode === 'login' ? 'living-loom-tab--active' : ''}`}
                onClick={() => handleModeChange('login')}
              >
                <Icon name="user" size={16} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                id="tab-register"
                role="tab"
                aria-selected={mode === 'register'}
                aria-controls="panel-register"
                className={`living-loom-tab ${mode === 'register' ? 'living-loom-tab--active' : ''}`}
                onClick={() => handleModeChange('register')}
              >
                <Icon name="user-plus" size={16} />
                <span>Create Account</span>
              </button>
            </nav>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="living-loom-alert living-loom-alert--error" role="alert">
              <Icon name="close" size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="living-loom-alert living-loom-alert--success" role="status">
              <Icon name="check" size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'login' && (
            <form
              id="panel-signin"
              role="tabpanel"
              aria-labelledby="tab-signin"
              className="living-loom-form"
              onSubmit={handleLoginSubmit}
              noValidate
            >
              <div className="living-loom-form-group">
                <label htmlFor="living-loom-login-email">Email Address</label>
                <div className="living-loom-input-wrapper">
                  <input
                    id="living-loom-login-email"
                    type="email"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="patron@handloomconnect.org"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="living-loom-form-group">
                <div className="living-loom-form-group__header">
                  <label htmlFor="living-loom-login-password">Password</label>
                  <button
                    type="button"
                    className="living-loom-link-btn"
                    onClick={() => {
                      setErrorMessage('')
                      setSuccessMessage('')
                      setMode('forgot-password')
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="living-loom-input-wrapper">
                  <input
                    id="living-loom-login-password"
                    type={loginShowPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="living-loom-password-toggle"
                    onClick={() => setLoginShowPassword(prev => !prev)}
                    aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                    title={loginShowPassword ? 'Hide password' : 'Show password'}
                  >
                    <Icon name={loginShowPassword ? 'eye-off' : 'eye'} size={18} />
                  </button>
                </div>
              </div>

              <div className="living-loom-options-row">
                <label className="living-loom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember my email</span>
                </label>
              </div>

              <button
                type="submit"
                className="living-loom-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="living-loom-btn-loading">
                    <span className="living-loom-spinner" />
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <span>Sign In to Atelier</span>
                )}
              </button>


            </form>
          )}

          {/* MODE: CREATE ACCOUNT */}
          {mode === 'register' && (
            <form
              id="panel-register"
              role="tabpanel"
              aria-labelledby="tab-register"
              className="living-loom-form"
              onSubmit={handleRegisterSubmit}
              noValidate
            >
              <div className="living-loom-form-group">
                <label htmlFor="living-loom-reg-name">Full Name</label>
                <div className="living-loom-input-wrapper">
                  <input
                    id="living-loom-reg-name"
                    type="text"
                    autoComplete="name"
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    placeholder="e.g. Ananya Sen"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="living-loom-form-group">
                <label htmlFor="living-loom-reg-email">Email Address</label>
                <div className="living-loom-input-wrapper">
                  <input
                    id="living-loom-reg-email"
                    type="email"
                    autoComplete="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="patron@handloomconnect.org"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="living-loom-form-row">
                <div className="living-loom-form-group">
                  <label htmlFor="living-loom-reg-pwd">Password (min. 8)</label>
                  <div className="living-loom-input-wrapper">
                    <input
                      id="living-loom-reg-pwd"
                      type={regShowPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="living-loom-password-toggle"
                      onClick={() => setRegShowPassword(prev => !prev)}
                      aria-label={regShowPassword ? 'Hide password' : 'Show password'}
                      title={regShowPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={regShowPassword ? 'eye-off' : 'eye'} size={18} />
                    </button>
                  </div>
                </div>

                <div className="living-loom-form-group">
                  <label htmlFor="living-loom-reg-confirm">Confirm Password</label>
                  <div className="living-loom-input-wrapper">
                    <input
                      id="living-loom-reg-confirm"
                      type={regShowPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="living-loom-options-row">
                <label className="living-loom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="living-loom-terms-text">
                    I agree to the{' '}
                    <Link to="/about" className="living-loom-inline-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/about" className="living-loom-inline-link">
                      Artisan Heritage Charter
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="living-loom-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="living-loom-btn-loading">
                    <span className="living-loom-spinner" />
                    <span>Creating Patron Profile...</span>
                  </span>
                ) : (
                  <span>Register with Handloom Connect</span>
                )}
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot-password' && (
            <form className="living-loom-form" onSubmit={handleResetSubmit} noValidate>
              {!resetSent ? (
                <>
                  <div className="living-loom-form-group">
                    <label htmlFor="living-loom-reset-email">Account Email</label>
                    <div className="living-loom-input-wrapper">
                      <input
                        id="living-loom-reset-email"
                        type="email"
                        autoComplete="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        placeholder="patron@handloomconnect.org"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="living-loom-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="living-loom-btn-loading">
                        <span className="living-loom-spinner" />
                        <span>Sending Instructions...</span>
                      </span>
                    ) : (
                      <span>Send Recovery Instructions</span>
                    )}
                  </button>
                </>
              ) : (
                <div className="living-loom-reset-sent-box">
                  <Icon name="mail" size={28} />
                  <p>
                    Please check your inbox and spam folder for instructions to reset your atelier password.
                  </p>
                </div>
              )}

              <div className="living-loom-footer-nav">
                <button
                  type="button"
                  className="living-loom-back-btn"
                  onClick={() => {
                    setErrorMessage('')
                    setSuccessMessage('')
                    setResetSent(false)
                    handleModeChange('login')
                  }}
                >
                  <Icon name="arrow" size={16} />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* Card Footer Switch */}
          {mode !== 'forgot-password' && (
            <footer className="living-loom-card__footer">
              {mode === 'login' ? (
                <p>
                  New to Handloom Connect?{' '}
                  <button
                    type="button"
                    className="living-loom-inline-switch"
                    onClick={() => handleModeChange('register')}
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an atelier account?{' '}
                  <button
                    type="button"
                    className="living-loom-inline-switch"
                    onClick={() => handleModeChange('login')}
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
