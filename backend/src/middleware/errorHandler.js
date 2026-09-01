import { sendError } from '../utils/response.js'

/**
 * Centralized Express Error Handler
 */
export function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err)

  // MySQL connection & access security masking
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return sendError(res, 'Database connection error. Service is temporarily unavailable.', 503, 'SERVICE_UNAVAILABLE')
  }

  // MySQL specific errors
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 'Duplicate record already exists.', 409, 'DUPLICATE_ENTRY')
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return sendError(res, 'Referenced item not found.', 400, 'FOREIGN_KEY_VIOLATION')
  }

  // Syntax or payload error
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 'Malformed JSON payload.', 400, 'INVALID_JSON')
  }

  const statusCode = err.statusCode || err.status || 500
  const message = (process.env.NODE_ENV === 'production' && statusCode === 500)
    ? 'Internal Server Error'
    : (err.message && !err.message.includes('mysql') ? err.message : 'An error occurred while processing your request')

  return sendError(res, message, statusCode, err.code || 'INTERNAL_ERROR')
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res) {
  return sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND')
}
