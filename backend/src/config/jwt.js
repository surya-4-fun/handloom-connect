import dotenv from 'dotenv'

dotenv.config()

/**
 * Retrieves the JWT secret from environment configuration.
 * Strictly throws an error if missing, guaranteeing that no predictable
 * or hardcoded fallback secret is ever used for signing or verification.
 * 
 * @returns {string} The configured JWT secret
 * @throws {Error} If JWT_SECRET is missing or empty
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET.trim() : ''
  if (!secret) {
    const isProduction = process.env.NODE_ENV === 'production'
    const message = isProduction
      ? 'FATAL: JWT_SECRET environment variable must be configured in production.'
      : 'JWT_SECRET environment variable is not configured. Please set JWT_SECRET in your environment or .env file.'
    throw new Error(message)
  }
  return secret
}

/**
 * Validates JWT configuration at server startup.
 * Halts startup in production if JWT_SECRET is absent.
 * 
 * @returns {boolean} True if configured properly
 */
export function validateJwtConfig() {
  const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET.trim() : ''
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ FATAL SECURITY ERROR: JWT_SECRET is not configured in production mode.')
      throw new Error('JWT_SECRET must be configured in production.')
    } else {
      console.warn('⚠️ WARNING: JWT_SECRET is not configured. JWT authentication will fail until JWT_SECRET is set.')
    }
    return false
  }
  return true
}

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
