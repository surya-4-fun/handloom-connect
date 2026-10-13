import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../primitives/Icon'
import { RingCanvas3D } from './RingCanvas3D'
import handloomEmblem from '../../assets/images/handloom-logo-emblem.png'

interface AuthExperienceProps {
  initialMode?: 'login' | 'register'
}

type AuthMode = 'login' | 'register' | 'forgot-password'

export function AuthExperience({ initialMode = 'login' }: AuthExperienceProps) {
  const { user, isAuthenticated, login, register, resetPassword, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<AuthMode>(initialMode)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginShowPassword, setLoginShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Register form state
  const [fullName, setFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regShowPassword, setRegShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Forgot password form state
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  // Feedback states
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Track return route
  const from = location.state?.from?.pathname || '/profile'

  // Sync mode if pathname changes
  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setMode('register')
    } else if (location.pathname === '/login') {
      setMode(prev => (prev === 'forgot-password' ? 'forgot-password' : 'login'))
    }
  }, [location.pathname])

  // Close handler: smoothly return to prior screen or home
  const handleClose = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }, [navigate])

  // Keyboard shortcut (Escape to close) and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [handleClose])

  const switchMode = (newMode: AuthMode) => {
    setError('')
    setSuccessMsg('')
    setMode(newMode)
    if (newMode === 'login') {
      navigate('/login', { replace: true })
    } else if (newMode === 'register') {
      navigate('/register', { replace: true })
    }
  }

  // Handle Login submission with Supabase
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please provide your email and password.')
      return
    }

    try {
      await login({ email: loginEmail.trim(), password: loginPassword })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify and try again.')
    }
  }

  // Handle Register submission with Supabase
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!fullName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setError('Please complete all fields.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the Direct Trade Atelier Terms.')
      return
    }

    try {
      await register({
        fullName: fullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        acceptTerms,
      })
      navigate('/profile', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    }
  }

  // Handle Password Reset submission with Supabase
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!resetEmail.trim()) {
      setError('Please provide your email address.')
      return
    }

    try {
      await resetPassword(resetEmail.trim())
      setResetSent(true)
      setSuccessMsg('Recovery instructions sent to your email.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setMode('login')
    } catch (err: unknown) {
      console.error('Logout error:', err)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'HC'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="auth-immersive-container" role="dialog" aria-modal="true" aria-label="Account and Authentication Experience">
      {/* 3D WebGL Organic Ring Canvas Layer (DOMINATING VISUAL ELEMENT) */}
      <RingCanvas3D className="auth-immersive-ring-canvas" />

      {/* Radial Shadow Aperture to frame central text and guarantee 100% legibility */}
      <div className="auth-immersive-aperture" aria-hidden="true" />

      {/* PERIPHERAL MINIMAL INTERFACE (Directly matching Jesper Landberg reference layout) */}
      {/* Upper-Left: Minimal Brand Lockup */}
      <div className="auth-peripheral-brand">
        <Link to="/" className="auth-peripheral-brand-link" onClick={handleClose}>
          <img src={handloomEmblem} alt="Handloom Connect Emblem" className="auth-peripheral-emblem" />
          <div className="auth-peripheral-titles">
            <span className="auth-peripheral-title-main">HANDLOOM CONNECT</span>
            <span className="auth-peripheral-title-sub">ATELIER DIRECT TRADE</span>
          </div>
        </Link>
      </div>

      {/* Upper-Right: Clean Minimal Close Button */}
      <button
        type="button"
        className="auth-peripheral-close-btn"
        onClick={handleClose}
        aria-label="Close Account Experience (Esc)"
        title="Close (Esc)"
      >
        <span>CLOSE</span>
        <span className="close-btn-cross" aria-hidden="true">✕</span>
      </button>

      {/* Lower-Left Contextual Indicator */}
      <div className="auth-peripheral-meta auth-peripheral-meta--left">
        <span className="meta-accent">DIRECT TRADE</span>
        <span className="meta-sep">/</span>
        <span>GI-CERTIFIED WEAVES</span>
      </div>

      {/* Lower-Right Contextual Indicator */}
      <div className="auth-peripheral-meta auth-peripheral-meta--right">
        <span>HERITAGE ATELIER</span>
        <span className="meta-sep">•</span>
        <span>EST. 2024</span>
      </div>

      {/* CENTRAL CONTENT AREA (Centered horizontally & vertically inside the large ring opening) */}
      <div className="auth-immersive-center">
        <div className="auth-inner-stage">
          {isAuthenticated && user ? (
            /* --- SIGNED-IN ACCOUNT BEHAVIOR --- */
            <motion.div
              key="signed-in-profile"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="auth-profile-stage"
            >
              <div className="profile-stage-avatar-wrap">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="profile-stage-avatar" />
                ) : (
                  <div className="profile-stage-avatar-placeholder">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <span className="profile-stage-badge-dot" title="Authenticated Patron" />
              </div>

              <div className="profile-stage-header">
                <span className="profile-stage-tagline">ATELIER PATRON</span>
                <h2 className="profile-stage-name">{user.fullName}</h2>
                <p className="profile-stage-email">{user.email}</p>
              </div>

              <div className="profile-stage-actions">
                <Link to="/order-tracking" className="profile-stage-action-btn profile-stage-action-btn--primary">
                  <Icon name="bag" size={16} />
                  <span>Order Tracking & History</span>
                </Link>

                <Link to="/wishlist" className="profile-stage-action-btn">
                  <Icon name="heart" size={16} />
                  <span>Saved Heirlooms</span>
                </Link>

                <Link to="/profile" className="profile-stage-action-btn">
                  <Icon name="user" size={16} />
                  <span>Detailed Account Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="profile-stage-logout-btn"
                  disabled={isLoading}
                >
                  <Icon name="logout" size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* --- AUTHENTICATION INTERACTION (Sign In / Register / Reset) --- */
            <div className="auth-stage-content">
              {/* Mode Tabs (Sign In / Create Account) */}
              {mode !== 'forgot-password' && (
                <div className="auth-stage-tabs" role="tablist" aria-label="Sign in or register">
                  <button
                    type="button"
                    role="tab"
                    id="tab-signin"
                    aria-selected={mode === 'login'}
                    className={`auth-tab-btn ${mode === 'login' ? 'is-active' : ''}`}
                    onClick={() => switchMode('login')}
                  >
                    <span>SIGN IN</span>
                    {mode === 'login' && (
                      <motion.span
                        layoutId="auth-tab-active-indicator"
                        className="auth-tab-active-line"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    role="tab"
                    id="tab-register"
                    aria-selected={mode === 'register'}
                    className={`auth-tab-btn ${mode === 'register' ? 'is-active' : ''}`}
                    onClick={() => switchMode('register')}
                  >
                    <span>CREATE ACCOUNT</span>
                    {mode === 'register' && (
                      <motion.span
                        layoutId="auth-tab-active-indicator"
                        className="auth-tab-active-line"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                </div>
              )}

              {/* Status Alert Notification */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="auth-error-banner"
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="auth-alert auth-alert--error"
                    role="alert"
                  >
                    <Icon name="info" size={15} />
                    <span>{error}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    key="auth-success-banner"
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="auth-alert auth-alert--success"
                    role="status"
                  >
                    <Icon name="check" size={15} />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Forms Animated Container */}
              <AnimatePresence mode="wait">
                {mode === 'login' && (
                  /* ================= SIGN IN FORM ================= */
                  <motion.form
                    key="form-login"
                    onSubmit={handleLoginSubmit}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="auth-form"
                    noValidate
                  >
                    <div className="auth-form-field">
                      <label htmlFor="login-email" className="auth-form-label">
                        Email Address
                      </label>
                      <div className="auth-input-shell">
                        <input
                          id="login-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={loginEmail}
                          onChange={e => setLoginEmail(e.target.value)}
                          placeholder="patron@handloom.art"
                          className="auth-text-input"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="auth-form-field">
                      <div className="auth-label-row">
                        <label htmlFor="login-password" className="auth-form-label">
                          Password
                        </label>
                        <button
                          type="button"
                          className="auth-link-btn"
                          onClick={() => setMode('forgot-password')}
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="auth-input-shell">
                        <input
                          id="login-password"
                          type={loginShowPassword ? 'text' : 'password'}
                          name="password"
                          autoComplete="current-password"
                          required
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="auth-text-input"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="auth-eye-btn"
                          onClick={() => setLoginShowPassword(v => !v)}
                          aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                          tabIndex={-1}
                        >
                          <Icon name={loginShowPassword ? 'eye-off' : 'eye'} size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="auth-form-meta-row">
                      <label className="auth-checkbox-label">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="auth-checkbox"
                        />
                        <span>Remember credentials</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-submit-btn"
                    >
                      {isLoading ? (
                        <span className="auth-btn-spinner-wrap">
                          <span className="auth-spinner" />
                          <span>Verifying...</span>
                        </span>
                      ) : (
                        <span>Sign In to Atelier</span>
                      )}
                    </button>

                    <p className="auth-switch-prompt">
                      <span>New to Handloom Connect?</span>
                      <button
                        type="button"
                        onClick={() => switchMode('register')}
                        className="auth-switch-btn"
                      >
                        Create an account
                      </button>
                    </p>
                  </motion.form>
                )}

                {mode === 'register' && (
                  /* ================= CREATE ACCOUNT FORM ================= */
                  <motion.form
                    key="form-register"
                    onSubmit={handleRegisterSubmit}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="auth-form"
                    noValidate
                  >
                    <div className="auth-form-field">
                      <label htmlFor="reg-fullname" className="auth-form-label">
                        Full Name
                      </label>
                      <div className="auth-input-shell">
                        <input
                          id="reg-fullname"
                          type="text"
                          name="name"
                          autoComplete="name"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="Your Full Name"
                          className="auth-text-input"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="auth-form-field">
                      <label htmlFor="reg-email" className="auth-form-label">
                        Email Address
                      </label>
                      <div className="auth-input-shell">
                        <input
                          id="reg-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          placeholder="patron@handloom.art"
                          className="auth-text-input"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="auth-form-row">
                      <div className="auth-form-field">
                        <label htmlFor="reg-password" className="auth-form-label">
                          Password
                        </label>
                        <div className="auth-input-shell">
                          <input
                            id="reg-password"
                            type={regShowPassword ? 'text' : 'password'}
                            name="new-password"
                            autoComplete="new-password"
                            required
                            value={regPassword}
                            onChange={e => setRegPassword(e.target.value)}
                            placeholder="8+ characters"
                            className="auth-text-input"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="auth-form-field">
                        <label htmlFor="reg-confirm" className="auth-form-label">
                          Confirm
                        </label>
                        <div className="auth-input-shell">
                          <input
                            id="reg-confirm"
                            type={regShowPassword ? 'text' : 'password'}
                            name="confirm-password"
                            autoComplete="new-password"
                            required
                            value={regConfirmPassword}
                            onChange={e => setRegConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="auth-text-input"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="auth-eye-btn"
                            onClick={() => setRegShowPassword(v => !v)}
                            aria-label={regShowPassword ? 'Hide password' : 'Show password'}
                            tabIndex={-1}
                          >
                            <Icon name={regShowPassword ? 'eye-off' : 'eye'} size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <label className="auth-checkbox-label">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={e => setAcceptTerms(e.target.checked)}
                        className="auth-checkbox"
                        required
                      />
                      <span>I pledge support for Direct Trade & GI Authentic Craft</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-submit-btn"
                    >
                      {isLoading ? (
                        <span className="auth-btn-spinner-wrap">
                          <span className="auth-spinner" />
                          <span>Creating Atelier Account...</span>
                        </span>
                      ) : (
                        <span>Join the Handloom Atelier</span>
                      )}
                    </button>

                    <p className="auth-switch-prompt">
                      <span>Already a patron?</span>
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="auth-switch-btn"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.form>
                )}

                {mode === 'forgot-password' && (
                  /* ================= FORGOT PASSWORD FORM ================= */
                  <motion.form
                    key="form-reset"
                    onSubmit={handleResetSubmit}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="auth-form"
                    noValidate
                  >
                    <div className="auth-reset-heading">
                      <h3 className="auth-reset-title">Recover Password</h3>
                      <p className="auth-reset-desc">
                        Provide the email associated with your atelier account and we will send recovery instructions.
                      </p>
                    </div>

                    {!resetSent ? (
                      <>
                        <div className="auth-form-field">
                          <label htmlFor="reset-email" className="auth-form-label">
                            Email Address
                          </label>
                          <div className="auth-input-shell">
                            <input
                              id="reset-email"
                              type="email"
                              name="email"
                              autoComplete="email"
                              required
                              value={resetEmail}
                              onChange={e => setResetEmail(e.target.value)}
                              placeholder="patron@handloom.art"
                              className="auth-text-input"
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="auth-submit-btn"
                        >
                          {isLoading ? (
                            <span className="auth-btn-spinner-wrap">
                              <span className="auth-spinner" />
                              <span>Sending Instructions...</span>
                            </span>
                          ) : (
                            <span>Send Recovery Instructions</span>
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="auth-reset-success-note">
                        <Icon name="check" size={24} />
                        <p>If an account exists for {resetEmail}, instructions have been dispatched.</p>
                      </div>
                    )}

                    <div className="auth-reset-footer">
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="auth-back-link-btn"
                      >
                        <span>← Return to Sign In</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
