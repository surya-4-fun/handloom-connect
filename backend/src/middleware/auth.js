import jwt from 'jsonwebtoken'
import { sendError } from '../utils/response.js'

const JWT_SECRET = process.env.JWT_SECRET || 'handloom_connect_dev_secret_jwt_2026_secure_key'

/**
 * Middleware to require authenticated user via JWT Bearer token.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
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
      const decoded = jwt.verify(token, JWT_SECRET)
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
