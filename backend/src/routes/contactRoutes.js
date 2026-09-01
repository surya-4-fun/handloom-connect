import { Router } from 'express'
import { body } from 'express-validator'
import { contactController } from '../controllers/contactController.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message cannot be empty'),
    validate
  ],
  contactController.submitContact
)

export default router
