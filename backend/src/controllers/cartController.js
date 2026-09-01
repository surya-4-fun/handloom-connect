import { cartModel } from '../models/cartModel.js'
import { sendSuccess } from '../utils/response.js'

export const cartController = {
  async getCart(req, res, next) {
    try {
      const items = await cartModel.getCart(req.user.id)
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

      return sendSuccess(res, {
        items,
        subtotal,
        totalCount
      }, 'Cart retrieved')
    } catch (err) {
      next(err)
    }
  },

  async addItem(req, res, next) {
    try {
      const { productId, quantity = 1 } = req.body
      const items = await cartModel.addItem(req.user.id, productId, Number(quantity))
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

      return sendSuccess(res, {
        items,
        subtotal,
        totalCount
      }, 'Item added to cart')
    } catch (err) {
      next(err)
    }
  },

  async updateQuantity(req, res, next) {
    try {
      const { productId } = req.params
      const { quantity } = req.body
      const items = await cartModel.updateQuantity(req.user.id, productId, Number(quantity))
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

      return sendSuccess(res, {
        items,
        subtotal,
        totalCount
      }, 'Cart item updated')
    } catch (err) {
      next(err)
    }
  },

  async removeItem(req, res, next) {
    try {
      const { productId } = req.params
      const items = await cartModel.removeItem(req.user.id, productId)
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

      return sendSuccess(res, {
        items,
        subtotal,
        totalCount
      }, 'Item removed from cart')
    } catch (err) {
      next(err)
    }
  },

  async clearCart(req, res, next) {
    try {
      await cartModel.clearCart(req.user.id)
      return sendSuccess(res, { items: [], subtotal: 0, totalCount: 0 }, 'Cart cleared')
    } catch (err) {
      next(err)
    }
  },

  async syncCart(req, res, next) {
    try {
      const { items } = req.body
      const synced = await cartModel.syncCart(req.user.id, items)
      const subtotal = synced.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalCount = synced.reduce((sum, item) => sum + item.quantity, 0)

      return sendSuccess(res, {
        items: synced,
        subtotal,
        totalCount
      }, 'Cart synced')
    } catch (err) {
      next(err)
    }
  }
}
