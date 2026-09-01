import { Router } from 'express'
import { body } from 'express-validator'
import { authController } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('acceptTerms').custom(v => v === true || v === 'true').withMessage('You must accept terms and conditions'),
    validate
  ],
  authController.register
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.login
)

router.get('/me', requireAuth, authController.getMe)
router.post('/logout', authController.logout)

export default router
