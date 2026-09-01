/**
 * Standardized API Response Utilities
 */

export function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export function sendError(res, message = 'Internal Server Error', statusCode = 500, code = 'ERROR', errors = null) {
  const payload = {
    success: false,
    message,
    code,
  }

  if (errors) {
    payload.errors = errors
  }

  return res.status(statusCode).json(payload)
}
