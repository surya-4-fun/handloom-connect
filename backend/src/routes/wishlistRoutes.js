import { Router } from 'express'
import { body } from 'express-validator'
import { wishlistController } from '../controllers/wishlistController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.use(requireAuth)

router.get('/', wishlistController.getWishlist)
router.post(
  '/toggle',
  [
    body('productId').trim().notEmpty().withMessage('Product ID is required'),
    validate
  ],
  wishlistController.toggleWishlist
)

export default router
