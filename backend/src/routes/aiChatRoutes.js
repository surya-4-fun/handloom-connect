import { Router } from 'express'
import { body } from 'express-validator'
import { aiChatController } from '../controllers/aiChatController.js'
import { validate } from '../middleware/validator.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

router.post(
  '/chat',
  optionalAuth,
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('message').isLength({ max: 1000 }).withMessage('Message is too long (max 1000 characters)'),
    body('history').optional().isArray().withMessage('History must be an array'),
    body('context').optional().isObject().withMessage('Context must be an object'),
    validate
  ],
  aiChatController.processChat
)

export default router
