import { Router } from 'express'
import { body } from 'express-validator'
import { orderController } from '../controllers/orderController.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.post(
  '/',
  optionalAuth,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required in order'),
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('deliveryMethod').isObject().withMessage('Delivery method is required'),
    body('paymentDetails').isObject().withMessage('Payment details are required'),
    validate
  ],
  orderController.createOrder
)

router.get('/', requireAuth, orderController.getMyOrders)
router.get('/:id', optionalAuth, orderController.getOrderById)
router.get('/:id/tracking', optionalAuth, orderController.getOrderTracking)

export default router
