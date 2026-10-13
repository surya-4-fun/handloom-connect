import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../primitives/Icon'
import { Button } from '../primitives/Button'
import { InteractiveBubble } from './InteractiveBubble'
import { StorytellingAuthPanel } from './StorytellingAuthPanel'

interface AuthExperienceProps {
  initialMode?: 'login' | 'register'
}

type AuthMode = 'login' | 'register' | 'forgot-password'

export function AuthExperience({ initialMode = 'login' }: AuthExperienceProps) {
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

  // Status state
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { login, register, resetPassword, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Track path from navigation or default to /profile
  const from = location.state?.from?.pathname || '/profile'

  // Sync mode if initialMode prop or path changes
  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setMode('register')
    } else if (location.pathname === '/login') {
      setMode(prev => (prev === 'forgot-password' ? 'forgot-password' : 'login'))
    }
  }, [location.pathname])

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

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter both your email and password.')
      return
    }

    try {
      await login({ email: loginEmail.trim(), password: loginPassword })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify and try again.')
    }
  }

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!fullName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setError('Please fill in all required fields.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (regPassword.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy.')
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

  // Handle Forgot Password submission
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!resetEmail.trim()) {
      setError('Please enter your email address.')
      return
    }

    try {
      await resetPassword(resetEmail.trim())
      setResetSent(true)
      setSuccessMsg('Recovery instructions have been sent to your email.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions.')
    }
  }

  return (
    <div className="auth-experience-root">
      {/* LEFT COLUMN: Immersive Visual Storytelling */}
      <section className="auth-column auth-column--story" aria-label="Handloom Connect Heritage Story">
        <StorytellingAuthPanel />
      </section>

      {/* RIGHT COLUMN: Interactive Bubble Authentication */}
      <section className="auth-column auth-column--interactive" aria-label="Authentication Portal">
        <div className="auth-bubble-viewport">
          {/* Fluid Organic Bubble Container */}
          <InteractiveBubble mode={mode} className="auth-central-bubble">
            <div className="auth-bubble-card">
              {/* Header Mode Switcher Tab (Pill Toggle) */}
              <div className="bubble-mode-tabs" role="tablist" aria-label="Authentication view switcher">
                <button
                  type="button"
                  role="tab"
                  id="tab-signin"
                  aria-selected={mode === 'login'}
                  aria-controls="panel-auth"
                  className={`bubble-tab-btn ${mode === 'login' ? 'is-active' : ''}`}
                  onClick={() => switchMode('login')}
                  disabled={isLoading}
                >
                  <span>Sign In</span>
                  {mode === 'login' && (
                    <motion.span
                      layoutId="bubble-tab-active-indicator"
                      className="bubble-tab-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-signup"
                  aria-selected={mode === 'register'}
                  aria-controls="panel-auth"
                  className={`bubble-tab-btn ${mode === 'register' ? 'is-active' : ''}`}
                  onClick={() => switchMode('register')}
                  disabled={isLoading}
                >
                  <span>Create Account</span>
                  {mode === 'register' && (
                    <motion.span
                      layoutId="bubble-tab-active-indicator"
                      className="bubble-tab-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              </div>

              {/* Status Alert Messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error-alert"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    className="bubble-feedback-banner bubble-feedback-banner--error"
                    role="alert"
                  >
                    <Icon name="info" size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    key="success-alert"
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    className="bubble-feedback-banner bubble-feedback-banner--success"
                    role="status"
                  >
                    <Icon name="check" size={16} />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* In-Bubble Form View Morphing */}
              <div id="panel-auth" className="bubble-form-viewport">
                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'login' && (
                    <motion.div
                      key="login-panel"
                      initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: 14, filter: 'blur(4px)' }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="bubble-form-panel"
                    >
                      <div className="bubble-panel-title">
                        <h3>Welcome to the Atelier</h3>
                        <p>Sign in to access curated heirlooms & your patron collection</p>
                      </div>

                      <form className="bubble-form" onSubmit={handleLoginSubmit} noValidate>
                        <div className="bubble-field-group">
                          <label htmlFor="login-email">Email Address</label>
                          <div className="bubble-input-wrapper">
                            <span className="bubble-input-icon"><Icon name="mail" size={16} /></span>
                            <input
                              id="login-email"
                              type="email"
                              autoComplete="email"
                              value={loginEmail}
                              onChange={e => setLoginEmail(e.target.value)}
                              placeholder="patron@handloomconnect.org"
                              required
                              disabled={isLoading}
                              className="bubble-input"
                            />
                          </div>
                        </div>

                        <div className="bubble-field-group">
                          <div className="bubble-label-row">
                            <label htmlFor="login-password">Password</label>
                            <button
                              type="button"
                              className="bubble-text-btn"
                              onClick={() => {
                                setResetEmail(loginEmail)
                                switchMode('forgot-password')
                              }}
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="bubble-input-wrapper">
                            <span className="bubble-input-icon"><Icon name="shield" size={16} /></span>
                            <input
                              id="login-password"
                              type={loginShowPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              value={loginPassword}
                              onChange={e => setLoginPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                              disabled={isLoading}
                              className="bubble-input"
                            />
                            <button
                              type="button"
                              className="bubble-pw-toggle"
                              onClick={() => setLoginShowPassword(v => !v)}
                              aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                              tabIndex={0}
                            >
                              <Icon name={loginShowPassword ? 'close' : 'eye'} size={17} />
                            </button>
                          </div>
                        </div>

                        <div className="bubble-aux-row">
                          <label className="bubble-checkbox-label">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={e => setRememberMe(e.target.checked)}
                              disabled={isLoading}
                            />
                            <span>Remember this device</span>
                          </label>
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          className="bubble-submit-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="btn-spinner-wrap">
                              <span className="btn-spinner" />
                              <span>Signing in...</span>
                            </span>
                          ) : (
                            <span className="btn-label-wrap">
                              <span>Enter Atelier</span>
                              <Icon name="arrow-right" size={16} />
                            </span>
                          )}
                        </Button>
                      </form>

                      <div className="bubble-footer-prompt">
                        <span>New to Handloom Connect?</span>
                        <button
                          type="button"
                          className="bubble-inline-switch-btn"
                          onClick={() => switchMode('register')}
                        >
                          Create an account
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'register' && (
                    <motion.div
                      key="register-panel"
                      initial={{ opacity: 0, x: 14, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="bubble-form-panel"
                    >
                      <div className="bubble-panel-title">
                        <h3>Join Handloom Connect</h3>
                        <p>Support artisan lineages & acquire certified heritage textiles</p>
                      </div>

                      <form className="bubble-form" onSubmit={handleRegisterSubmit} noValidate>
                        <div className="bubble-field-group">
                          <label htmlFor="reg-fullname">Full Name</label>
                          <div className="bubble-input-wrapper">
                            <span className="bubble-input-icon"><Icon name="user" size={16} /></span>
                            <input
                              id="reg-fullname"
                              type="text"
                              autoComplete="name"
                              value={fullName}
                              onChange={e => setFullName(e.target.value)}
                              placeholder="Ananya Sharma"
                              required
                              disabled={isLoading}
                              className="bubble-input"
                            />
                          </div>
                        </div>

                        <div className="bubble-field-group">
                          <label htmlFor="reg-email">Email Address</label>
                          <div className="bubble-input-wrapper">
                            <span className="bubble-input-icon"><Icon name="mail" size={16} /></span>
                            <input
                              id="reg-email"
                              type="email"
                              autoComplete="email"
                              value={regEmail}
                              onChange={e => setRegEmail(e.target.value)}
                              placeholder="ananya@example.com"
                              required
                              disabled={isLoading}
                              className="bubble-input"
                            />
                          </div>
                        </div>

                        <div className="bubble-field-row">
                          <div className="bubble-field-group">
                            <label htmlFor="reg-password">Password</label>
                            <div className="bubble-input-wrapper">
                              <input
                                id="reg-password"
                                type={regShowPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                required
                                disabled={isLoading}
                                className="bubble-input"
                              />
                              <button
                                type="button"
                                className="bubble-pw-toggle"
                                onClick={() => setRegShowPassword(v => !v)}
                                aria-label={regShowPassword ? 'Hide password' : 'Show password'}
                              >
                                <Icon name={regShowPassword ? 'close' : 'eye'} size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="bubble-field-group">
                            <label htmlFor="reg-confirm-password">Confirm Password</label>
                            <div className="bubble-input-wrapper">
                              <input
                                id="reg-confirm-password"
                                type={regShowPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={regConfirmPassword}
                                onChange={e => setRegConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                required
                                disabled={isLoading}
                                className="bubble-input"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bubble-aux-row">
                          <label className="bubble-checkbox-label">
                            <input
                              type="checkbox"
                              checked={acceptTerms}
                              onChange={e => setAcceptTerms(e.target.checked)}
                              disabled={isLoading}
                            />
                            <span className="bubble-terms-copy">
                              I accept the{' '}
                              <Link to="/about" className="bubble-legal-link">
                                Terms of Craft
                              </Link>{' '}
                              and{' '}
                              <Link to="/about" className="bubble-legal-link">
                                Privacy Policy
                              </Link>
                            </span>
                          </label>
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          className="bubble-submit-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="btn-spinner-wrap">
                              <span className="btn-spinner" />
                              <span>Creating Account...</span>
                            </span>
                          ) : (
                            <span className="btn-label-wrap">
                              <span>Register as Patron</span>
                              <Icon name="arrow-right" size={16} />
                            </span>
                          )}
                        </Button>
                      </form>

                      <div className="bubble-footer-prompt">
                        <span>Already registered?</span>
                        <button
                          type="button"
                          className="bubble-inline-switch-btn"
                          onClick={() => switchMode('login')}
                        >
                          Sign in instead
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'forgot-password' && (
                    <motion.div
                      key="forgot-panel"
                      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="bubble-form-panel"
                    >
                      <div className="bubble-panel-title">
                        <h3>Reset Patron Password</h3>
                        <p>Enter the email associated with your atelier account</p>
                      </div>

                      {resetSent ? (
                        <div className="bubble-reset-success-box">
                          <div className="reset-success-icon-wrap">
                            <Icon name="shield-check" size={32} />
                          </div>
                          <h4>Check Your Inbox</h4>
                          <p>
                            We have dispatched a secure password recovery link to{' '}
                            <strong>{resetEmail}</strong>.
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => switchMode('login')}
                            style={{ width: '100%', marginTop: '14px' }}
                          >
                            Return to Sign In
                          </Button>
                        </div>
                      ) : (
                        <form className="bubble-form" onSubmit={handleResetSubmit} noValidate>
                          <div className="bubble-field-group">
                            <label htmlFor="reset-email">Email Address</label>
                            <div className="bubble-input-wrapper">
                              <span className="bubble-input-icon"><Icon name="mail" size={16} /></span>
                              <input
                                id="reset-email"
                                type="email"
                                autoComplete="email"
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                placeholder="patron@handloomconnect.org"
                                required
                                disabled={isLoading}
                                className="bubble-input"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            className="bubble-submit-btn"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Sending Instructions...' : 'Send Recovery Link'}
                          </Button>

                          <div className="bubble-footer-prompt">
                            <button
                              type="button"
                              className="bubble-inline-switch-btn"
                              onClick={() => switchMode('login')}
                            >
                              ← Back to Sign In
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Handloom Direct Trade Micro Badge inside the Bubble */}
              <div className="bubble-bottom-seal">
                <span className="seal-emblem">❖</span>
                <span className="seal-text">Handloom Direct Trade Verified • 100% Artisan Living Wages</span>
              </div>
            </div>
          </InteractiveBubble>
        </div>
      </section>
    </div>
  )
}
