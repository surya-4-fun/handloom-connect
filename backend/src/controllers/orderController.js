import { orderModel } from '../models/orderModel.js'
import { sendSuccess, sendError } from '../utils/response.js'

const TRACKING_STAGES = [
  { stage: 0, title: '1. Raw Fiber Sourcing & Hank Washing', desc: 'Mulberry silk cocoons hand-reeled and degummed in mountain spring water.' },
  { stage: 1, title: '2. Organic Dyeing & Sun Drying', desc: 'Yarn dyed in small batches using natural madder root, indigo pits and marigold.' },
  { stage: 2, title: '3. Loom Setting & Warp Prep', desc: '2,400 warp threads manually aligned and threaded through heddle eyes.' },
  { stage: 3, title: '4. Master Weaving in Progress', desc: 'Over 105 hours of shuttle work completed with gold zari interlock.' },
  { stage: 4, title: '5. Quality Audit & GI Certification', desc: 'Handloom Mark verification, density inspection and weaver signature.' },
  { stage: 5, title: '6. Express Atelier Dispatch', desc: 'Padded heirloom packaging and direct dispatch with insurance.' },
]

export const orderController = {
  async createOrder(req, res, next) {
    try {
      const { items, shippingAddress, deliveryMethod, paymentDetails, includeGiftBox } = req.body
      const userId = req.user?.id || null

      const newOrder = await orderModel.createOrderWithItems({
        userId,
        items,
        shippingAddress,
        deliveryMethod,
        paymentDetails,
        includeGiftBox: Boolean(includeGiftBox)
      })

      return sendSuccess(res, newOrder, 'Order commissioned successfully', 201)
    } catch (err) {
      next(err)
    }
  },

  async getMyOrders(req, res, next) {
    try {
      const orders = await orderModel.getOrdersByUserId(req.user.id)
      return sendSuccess(res, orders, 'Order history retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params
      const order = await orderModel.getOrderById(id)

      if (!order) {
        return sendError(res, `Order "${id}" not found`, 404, 'ORDER_NOT_FOUND')
      }

      // Authorization check: If order is associated with a registered user, ensure only that user (or admin) can view it
      if (order.userId && req.user && req.user.id !== order.userId && req.user.role !== 'admin') {
        return sendError(res, 'Forbidden: You do not have permission to view this order.', 403, 'FORBIDDEN')
      }

      return sendSuccess(res, order, 'Order retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getOrderTracking(req, res, next) {
    try {
      const { id } = req.params
      const order = await orderModel.getOrderById(id)

      if (!order) {
        return sendError(res, `Order "${id}" not found`, 404, 'ORDER_NOT_FOUND')
      }

      const progressPercent = Math.min(100, Math.round((order.completedHours / order.totalHours) * 100))

      const trackingData = {
        order,
        stages: TRACKING_STAGES,
        currentStageIndex: order.currentStage,
        progressPercent,
        certificate: {
          silkMarkNo: order.silkMarkNo,
          giTagNo: order.giTagNo,
          artisan: order.items[0]?.artisanName || 'Master Weaver Guild',
          cluster: order.items[0]?.cluster || 'Kanchipuram, Tamil Nadu',
          estimatedDelivery: order.estimatedDelivery
        }
      }

      return sendSuccess(res, trackingData, 'Order tracking retrieved')
    } catch (err) {
      next(err)
    }
  }
}
