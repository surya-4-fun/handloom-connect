import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../primitives/Icon'
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

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
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
      setError('Please provide both your patron email and security password.')
      return
    }

    try {
      await login({ email: loginEmail.trim(), password: loginPassword })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.')
    }
  }

  // Handle Register submission with Supabase
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!fullName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setError('Please complete all required fields.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    if (regPassword.length < 8) {
      setError('Security key must be at least 8 characters long.')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the Direct Trade Atelier Terms to proceed.')
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
      setError('Please enter your email address to receive recovery instructions.')
      return
    }

    try {
      await resetPassword(resetEmail.trim())
      setResetSent(true)
      setSuccessMsg(`Recovery instructions dispatched to ${resetEmail.trim()}. Check your inbox.`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to dispatch reset instructions.')
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
    <div
      className="glass-auth-viewport auth-immersive-container"
      role="dialog"
      aria-modal="true"
      aria-label="Handloom Connect Atelier Authentication"
    >
      {/* =========================================================================
          ATMOSPHERIC EDITORIAL BACKGROUND (Banarasi Silk & Ambient Light Blooms)
          ========================================================================= */}
      <div className="glass-bg-layer" aria-hidden="true">
        {/* Genuine Banarasi zari silk photography with slow ambient zoom */}
        <div
          className="glass-bg-image"
          style={{ backgroundImage: `url('/images/products/banarasi-zari-saree.jpg')` }}
        />
        {/* Multi-layered luxury color gradients (Burgundy, Plum, Deep Onyx) */}
        <div className="glass-bg-vignette" />
        {/* Ambient atmospheric light blooms */}
        <div className="glass-bloom glass-bloom--gold" />
        <div className="glass-bloom glass-bloom--burgundy" />
        <div className="glass-bloom glass-bloom--plum" />
        {/* Subtle woven textile texture grid */}
        <div className="glass-bg-texture" />
      </div>

      {/* =========================================================================
          TOP PERIPHERAL EDITORIAL NAVIGATION BAR
          ========================================================================= */}
      <header className="glass-top-nav">
        <div className="glass-nav-left">
          <Link
            to="/"
            className="glass-brand-lockup auth-peripheral-brand-link"
            onClick={handleClose}
            aria-label="Handloom Connect Atelier Home"
          >
            <div className="glass-emblem-wrap">
              <img
                src={handloomEmblem}
                alt="Handloom Connect Golden Emblem"
                className="glass-brand-emblem auth-peripheral-emblem"
              />
            </div>
            <div className="glass-brand-text">
              <span className="glass-brand-title auth-peripheral-title-main">HANDLOOM CONNECT</span>
              <span className="glass-brand-tagline auth-peripheral-title-sub">ATELIER DIRECT TRADE</span>
            </div>
          </Link>
        </div>

        <div className="glass-nav-center">
          <span className="glass-nav-pill">
            <span className="glass-nav-pill-dot" />
            <span>AUTHENTIC INDIAN TEXTILE HERITAGE</span>
          </span>
        </div>

        <div className="glass-nav-right">
          <Link to="/marketplace" className="glass-nav-link" onClick={handleClose}>
            Marketplace
          </Link>
          <Link to="/artisans" className="glass-nav-link" onClick={handleClose}>
            Master Weavers
          </Link>
          <button
            type="button"
            className="glass-close-btn auth-peripheral-close-btn"
            onClick={handleClose}
            aria-label="Return to Store (Esc)"
            title="Return to Store (Esc)"
          >
            <span className="glass-close-text">Return to Store</span>
            <span className="glass-close-icon" aria-hidden="true">✕</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN EDITORIAL STAGE (Two-Part Split on Desktop, Refined Stack on Mobile)
          ========================================================================= */}
      <main className="glass-editorial-stage">
        <div className="glass-stage-container">
          {/* ---------------------------------------------------------------------
              LEFT SECTION: BRAND STORYTELLING & HERITAGE IDENTITY
              --------------------------------------------------------------------- */}
          <section className="glass-story-panel" aria-label="Brand Storytelling">
            <div className="glass-story-badge">
              <Icon name="sparkles" size={14} className="gold-icon" />
              <span>DIRECT TRADE WEAVERS GUILD</span>
              <span className="story-badge-sep">•</span>
              <span>EST. 2024</span>
            </div>

            <h1 className="glass-story-heading">
              Where <span className="glass-gold-gradient">Heritage</span>
              <br />
              Meets Tomorrow.
            </h1>

            <p className="glass-story-lead">
              Discover extraordinary handloom creations, connect directly with master artisans,
              and explore the sacred stories woven into every thread.
            </p>

            {/* Artisanal Value Credential Cards */}
            <div className="glass-credentials-grid">
              <div className="glass-credential-card">
                <div className="credential-icon-wrap">
                  <Icon name="shield-check" size={18} />
                </div>
                <div className="credential-info">
                  <h3 className="credential-title">GI-Certified Authenticity</h3>
                  <p className="credential-desc">Varanasi, Kanchipuram, Chanderi & Patola weaves authenticated at source.</p>
                </div>
              </div>

              <div className="glass-credential-card">
                <div className="credential-icon-wrap">
                  <Icon name="sparkles" size={18} />
                </div>
                <div className="credential-info">
                  <h3 className="credential-title">Direct Artisan Revenue</h3>
                  <p className="credential-desc">Transparent pricing model with 100% fair return to master looms.</p>
                </div>
              </div>

              <div className="glass-credential-card">
                <div className="credential-icon-wrap">
                  <Icon name="leaf" size={18} />
                </div>
                <div className="credential-info">
                  <h3 className="credential-title">Pure Natural Fibers</h3>
                  <p className="credential-desc">Mulberry silk, desi tussar, and heritage handspun khadi cotton.</p>
                </div>
              </div>
            </div>

            {/* Master Artisan Quote Card */}
            <div className="glass-artisan-quote-card">
              <div className="artisan-quote-avatar-wrap">
                <img
                  src="/images/artisans/ghulam-rasool.jpg"
                  alt="Master Weaver Ghulam Rasool"
                  className="artisan-quote-avatar"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.src = '/images/fallbacks/artisan-fallback.jpg'
                  }}
                />
              </div>
              <div className="artisan-quote-body">
                <p className="artisan-quote-text">
                  &ldquo;Every warp and weft carries centuries of prayers, patience, and the memory of ancient looms.&rdquo;
                </p>
                <div className="artisan-quote-author">
                  <span className="author-name">Ghulam Rasool</span>
                  <span className="author-title">Master Weaver • Varanasi Silk Guild</span>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------------
              RIGHT SECTION: FLOATING TRANSLUCENT GLASS LOGIN CARD
              --------------------------------------------------------------------- */}
          <section className="glass-card-column" aria-label="Atelier Patron Access">
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Upper Edge Light Reflection Highlight */}
              <div className="glass-card-reflection" aria-hidden="true" />

              {/* Card Header Emblem & Heading */}
              <div className="glass-card-header">
                <div className="glass-card-emblem-badge">
                  <img src={handloomEmblem} alt="" className="glass-card-emblem-icon" aria-hidden="true" />
                </div>
                <div className="glass-card-title-group">
                  <span className="glass-card-eyebrow">
                    {mode === 'login' ? 'PATRON SIGN IN' : mode === 'register' ? 'ATELIER REGISTRATION' : 'SECURITY RECOVERY'}
                  </span>
                  <h2 className="glass-card-title">
                    {mode === 'login' && 'Welcome to the Atelier'}
                    {mode === 'register' && 'Join the Artisan Guild'}
                    {mode === 'forgot-password' && 'Recover Security Key'}
                  </h2>
                  <p className="glass-card-subtitle">
                    {mode === 'login' && 'Enter your credentials to access your commissions & curated heirlooms.'}
                    {mode === 'register' && 'Create your patron profile to support master handloom weavers.'}
                    {mode === 'forgot-password' && 'Provide your registered email to receive access recovery details.'}
                  </p>
                </div>
              </div>

              {/* If Authenticated: Show Patron Account Overview */}
              {isAuthenticated && user ? (
                <div className="glass-patron-overview">
                  <div className="patron-avatar-row">
                    <div className="patron-avatar-circle">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="patron-avatar-img" />
                      ) : (
                        <span>{getInitials(user.fullName)}</span>
                      )}
                    </div>
                    <div className="patron-meta">
                      <span className="patron-badge">AUTHENTICATED PATRON</span>
                      <h3 className="patron-name">{user.fullName}</h3>
                      <p className="patron-email">{user.email}</p>
                    </div>
                  </div>

                  <div className="patron-actions">
                    <Link to="/order-tracking" className="glass-btn glass-btn-primary" onClick={handleClose}>
                      <Icon name="package" size={16} />
                      <span>Track Loom Commissions</span>
                    </Link>
                    <Link to="/wishlist" className="glass-btn glass-btn-secondary" onClick={handleClose}>
                      <Icon name="heart" size={16} />
                      <span>Saved Heirlooms</span>
                    </Link>
                    <Link to="/profile" className="glass-btn glass-btn-secondary" onClick={handleClose}>
                      <Icon name="user" size={16} />
                      <span>Patron Profile & Settings</span>
                    </Link>
                    <button
                      type="button"
                      className="glass-logout-btn"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      <Icon name="logout" size={15} />
                      <span>Sign Out from Atelier</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mode Tabs (Sign In vs Create Account) */}
                  {mode !== 'forgot-password' && (
                    <div className="glass-mode-tabs" role="tablist" aria-label="Authentication modes">
                      <button
                        type="button"
                        id="tab-signin"
                        role="tab"
                        aria-selected={mode === 'login'}
                        className={`glass-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => switchMode('login')}
                      >
                        <span>SIGN IN</span>
                        {mode === 'login' && <motion.div layoutId="tab-indicator" className="glass-tab-active-pill" />}
                      </button>

                      <button
                        type="button"
                        id="tab-register"
                        role="tab"
                        aria-selected={mode === 'register'}
                        className={`glass-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => switchMode('register')}
                      >
                        <span>CREATE ACCOUNT</span>
                        {mode === 'register' && <motion.div layoutId="tab-indicator" className="glass-tab-active-pill" />}
                      </button>
                    </div>
                  )}

                  {/* Feedback Banners (Glass alerts) */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        key="auth-error-banner"
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        className="glass-alert glass-alert--error auth-alert--error"
                        role="alert"
                      >
                        <Icon name="info" size={16} className="alert-icon" />
                        <span className="alert-text">{error}</span>
                      </motion.div>
                    )}

                    {successMsg && (
                      <motion.div
                        key="auth-success-banner"
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        className="glass-alert glass-alert--success auth-alert--success"
                        role="status"
                      >
                        <Icon name="check" size={16} className="alert-icon" />
                        <span className="alert-text">{successMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* -------------------------------------------------------------
                      MODE 1: SIGN IN FORM
                      ------------------------------------------------------------- */}
                  {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="glass-form" noValidate>
                      {/* Email Input */}
                      <div className="glass-field-group">
                        <label htmlFor="login-email" className="glass-field-label">
                          PATRON EMAIL
                        </label>
                        <div className="glass-input-wrapper">
                          <span className="glass-input-icon">
                            <Icon name="mail" size={16} />
                          </span>
                          <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="patron@handloomconnect.com"
                            className="glass-input"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Password Input with Visibility Toggle */}
                      <div className="glass-field-group">
                        <div className="glass-label-row">
                          <label htmlFor="login-password" className="glass-field-label">
                            SECURITY KEY
                          </label>
                          <button
                            type="button"
                            className="glass-text-link auth-link-btn"
                            onClick={() => switchMode('forgot-password')}
                          >
                            Forgot Key?
                          </button>
                        </div>
                        <div className="glass-input-wrapper">
                          <span className="glass-input-icon">
                            <Icon name="shield" size={16} />
                          </span>
                          <input
                            id="login-password"
                            name="password"
                            type={loginShowPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            placeholder="••••••••••••"
                            className="glass-input"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="glass-visibility-toggle"
                            onClick={() => setLoginShowPassword(prev => !prev)}
                            aria-label={loginShowPassword ? 'Hide security key' : 'Show security key'}
                            title={loginShowPassword ? 'Hide security key' : 'Show security key'}
                          >
                            <Icon name={loginShowPassword ? 'eye-off' : 'eye'} size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Remember Device Checkbox */}
                      <div className="glass-options-row">
                        <label className="glass-checkbox-label">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="glass-checkbox"
                          />
                          <span className="glass-checkbox-custom" aria-hidden="true">
                            {rememberMe && <Icon name="check" size={12} />}
                          </span>
                          <span className="glass-checkbox-text">Remember this workstation</span>
                        </label>
                      </div>

                      {/* Primary Sign In Button */}
                      <button
                        type="submit"
                        className="glass-btn glass-btn-primary auth-submit-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="glass-btn-spinner-content">
                            <span className="glass-spinner" />
                            <span>Authenticating Patron...</span>
                          </span>
                        ) : (
                          <span className="glass-btn-text-content">
                            <span>Access Atelier</span>
                            <Icon name="arrow-right" size={16} />
                          </span>
                        )}
                      </button>

                      {/* Switch to Registration */}
                      <div className="glass-switch-mode">
                        <span>New to the Atelier guild?</span>{' '}
                        <button
                          type="button"
                          className="glass-switch-link"
                          onClick={() => switchMode('register')}
                        >
                          Create an account
                        </button>
                      </div>
                    </form>
                  )}

                  {/* -------------------------------------------------------------
                      MODE 2: REGISTRATION FORM
                      ------------------------------------------------------------- */}
                  {mode === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="glass-form" noValidate>
                      {/* Full Name */}
                      <div className="glass-field-group">
                        <label htmlFor="reg-fullname" className="glass-field-label">
                          FULL LEGAL NAME
                        </label>
                        <div className="glass-input-wrapper">
                          <span className="glass-input-icon">
                            <Icon name="user" size={16} />
                          </span>
                          <input
                            id="reg-fullname"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            placeholder="Ananya Sharma"
                            className="glass-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="glass-field-group">
                        <label htmlFor="reg-email" className="glass-field-label">
                          PATRON EMAIL
                        </label>
                        <div className="glass-input-wrapper">
                          <span className="glass-input-icon">
                            <Icon name="mail" size={16} />
                          </span>
                          <input
                            id="reg-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="ananya@atelier.com"
                            className="glass-input"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Password & Confirm Password (Grid) */}
                      <div className="glass-form-row">
                        <div className="glass-field-group">
                          <label htmlFor="reg-password" className="glass-field-label">
                            CREATE KEY
                          </label>
                          <div className="glass-input-wrapper">
                            <span className="glass-input-icon">
                              <Icon name="shield" size={16} />
                            </span>
                            <input
                              id="reg-password"
                              name="password"
                              type={regShowPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              required
                              placeholder="Min. 8 chars"
                              className="glass-input"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              className="glass-visibility-toggle"
                              onClick={() => setRegShowPassword(prev => !prev)}
                              aria-label={regShowPassword ? 'Hide security key' : 'Show security key'}
                            >
                              <Icon name={regShowPassword ? 'eye-off' : 'eye'} size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="glass-field-group">
                          <label htmlFor="reg-confirm" className="glass-field-label">
                            CONFIRM KEY
                          </label>
                          <div className="glass-input-wrapper">
                            <span className="glass-input-icon">
                              <Icon name="shield-check" size={16} />
                            </span>
                            <input
                              id="reg-confirm"
                              name="confirmPassword"
                              type={regShowPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              required
                              placeholder="Confirm key"
                              className="glass-input"
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Direct Trade Terms Checkbox */}
                      <div className="glass-options-row">
                        <label className="glass-checkbox-label">
                          <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="glass-checkbox"
                          />
                          <span className="glass-checkbox-custom" aria-hidden="true">
                            {acceptTerms && <Icon name="check" size={12} />}
                          </span>
                          <span className="glass-checkbox-text">
                            I accept the{' '}
                            <Link to="/about" className="glass-inline-link">
                              Direct Trade Atelier Charter
                            </Link>{' '}
                            and Patron Ethics.
                          </span>
                        </label>
                      </div>

                      {/* Primary Register Button */}
                      <button
                        type="submit"
                        className="glass-btn glass-btn-primary auth-submit-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="glass-btn-spinner-content">
                            <span className="glass-spinner" />
                            <span>Creating Patron Guild Access...</span>
                          </span>
                        ) : (
                          <span className="glass-btn-text-content">
                            <span>Register Atelier Membership</span>
                            <Icon name="arrow-right" size={16} />
                          </span>
                        )}
                      </button>

                      {/* Switch to Sign In */}
                      <div className="glass-switch-mode">
                        <span>Already registered as a patron?</span>{' '}
                        <button
                          type="button"
                          className="glass-switch-link"
                          onClick={() => switchMode('login')}
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                  )}

                  {/* -------------------------------------------------------------
                      MODE 3: FORGOT PASSWORD FORM
                      ------------------------------------------------------------- */}
                  {mode === 'forgot-password' && (
                    <form onSubmit={handleResetSubmit} className="glass-form" noValidate>
                      <div className="glass-field-group">
                        <label htmlFor="reset-email" className="glass-field-label">
                          REGISTERED PATRON EMAIL
                        </label>
                        <div className="glass-input-wrapper">
                          <span className="glass-input-icon">
                            <Icon name="mail" size={16} />
                          </span>
                          <input
                            id="reset-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="patron@handloomconnect.com"
                            className="glass-input"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            disabled={isLoading || resetSent}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="glass-btn glass-btn-primary auth-submit-btn"
                        disabled={isLoading || resetSent}
                      >
                        {isLoading ? (
                          <span className="glass-btn-spinner-content">
                            <span className="glass-spinner" />
                            <span>Dispatching Recovery Key...</span>
                          </span>
                        ) : (
                          <span className="glass-btn-text-content">
                            <span>Send Recovery Instructions</span>
                            <Icon name="arrow-right" size={16} />
                          </span>
                        )}
                      </button>

                      <div className="glass-switch-mode">
                        <button
                          type="button"
                          className="glass-back-link auth-back-link-btn"
                          onClick={() => switchMode('login')}
                        >
                          <Icon name="arrow-right" size={14} className="icon-flip" />
                          <span>Return to Atelier Sign In</span>
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* Card Footer Security Seal */}
              <div className="glass-card-footer">
                <div className="glass-security-seal">
                  <Icon name="shield-check" size={13} className="seal-icon" />
                  <span>256-Bit Encrypted Patron Gateway • Supabase Secure Auth</span>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* =========================================================================
          BOTTOM PERIPHERAL SUBTLE CONTEXTUAL METRICS
          ========================================================================= */}
      <footer className="glass-bottom-metrics" aria-hidden="true">
        <div className="metric-tag auth-peripheral-meta auth-peripheral-meta--left">
          <span className="metric-accent meta-accent">DIRECT TRADE</span>
          <span className="metric-sep meta-sep">/</span>
          <span>14 WEAVING CLUSTERS</span>
        </div>
        <div className="metric-tag auth-peripheral-meta auth-peripheral-meta--right">
          <span>HERITAGE ATELIER</span>
          <span className="metric-sep meta-sep">•</span>
          <span>EST. 2024</span>
        </div>
      </footer>
    </div>
  )
}
