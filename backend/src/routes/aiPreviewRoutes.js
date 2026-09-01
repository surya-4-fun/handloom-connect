import { Router } from 'express'
import { body } from 'express-validator'
import { aiPreviewController } from '../controllers/aiPreviewController.js'
import { validate } from '../middleware/validator.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

router.post(
  '/product-preview',
  optionalAuth,
  [
    body('productId').trim().notEmpty().withMessage('Product ID is required'),
    body('height').isNumeric().withMessage('Height must be a numeric value in cm'),
    body('weight').isNumeric().withMessage('Weight must be a numeric value in kg'),
    body('bodyShape').optional().isString().trim(),
    validate
  ],
  aiPreviewController.generateProductPreview
)

export default router
