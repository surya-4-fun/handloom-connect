import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../config/jwt.js'
import { sendError } from '../utils/response.js'

/**
 * Middleware to require authenticated user via JWT Bearer token.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED')
  }

  let secret
  try {
    secret = getJwtSecret()
  } catch {
    return sendError(res, 'Authentication service misconfigured: missing JWT configuration.', 500, 'AUTH_CONFIG_ERROR')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session token expired. Please sign in again.', 401, 'TOKEN_EXPIRED')
    }
    return sendError(res, 'Invalid authentication token.', 401, 'INVALID_TOKEN')
  }
}

/**
 * Optional authentication: attaches user if valid token exists, but doesn't reject if omitted.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const secret = getJwtSecret()
      const decoded = jwt.verify(token, secret)
      req.user = decoded
    } catch {
      // Ignore error for optional auth
    }
  }

  next()
}

/**
 * Restrict to specific roles (e.g. 'artisan', 'admin').
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401, 'UNAUTHORIZED')
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: You do not have permission to perform this action.', 403, 'FORBIDDEN')
    }

    next()
  }
}
