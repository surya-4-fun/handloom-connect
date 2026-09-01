import { validationResult } from 'express-validator'
import { sendError } from '../utils/response.js'

/**
 * Middleware to check express-validator results and format errors cleanly.
 */
export function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }))
    return sendError(res, 'Validation failed for request data.', 400, 'VALIDATION_ERROR', formatted)
  }
  next()
}
