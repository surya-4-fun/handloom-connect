import { Router } from 'express'
import { body } from 'express-validator'
import { cartController } from '../controllers/cartController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.use(requireAuth)

router.get('/', cartController.getCart)
router.post(
  '/items',
  [
    body('productId').trim().notEmpty().withMessage('Product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    validate
  ],
  cartController.addItem
)
router.put(
  '/items/:productId',
  [
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be an integer >= 0'),
    validate
  ],
  cartController.updateQuantity
)
router.delete('/items/:productId', cartController.removeItem)
router.delete('/', cartController.clearCart)
router.post('/sync', cartController.syncCart)

export default router
