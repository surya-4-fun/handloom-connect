import { userModel } from '../models/userModel.js'
import { orderModel } from '../models/orderModel.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const userController = {
  async getProfile(req, res, next) {
    try {
      const [user, addresses, preferences, orders] = await Promise.all([
        userModel.findById(req.user.id),
        userModel.getAddresses(req.user.id),
        userModel.getPreferences(req.user.id),
        orderModel.getOrdersByUserId(req.user.id)
      ])

      if (!user) {
        return sendError(res, 'User not found.', 404, 'USER_NOT_FOUND')
      }

      return sendSuccess(res, {
        user,
        addresses,
        preferences,
        orderCount: orders.length
      }, 'User profile retrieved')
    } catch (err) {
      next(err)
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { fullName, avatarUrl } = req.body
      const updated = await userModel.updateProfile(req.user.id, { fullName, avatarUrl })
      return sendSuccess(res, updated, 'Profile updated successfully')
    } catch (err) {
      next(err)
    }
  },

  async getAddresses(req, res, next) {
    try {
      const addresses = await userModel.getAddresses(req.user.id)
      return sendSuccess(res, addresses, 'Addresses retrieved')
    } catch (err) {
      next(err)
    }
  },

  async addAddress(req, res, next) {
    try {
      const addressData = {
        id: `addr-${Date.now()}`,
        ...req.body
      }
      const address = await userModel.addAddress(req.user.id, addressData)
      return sendSuccess(res, address, 'Address added successfully', 201)
    } catch (err) {
      next(err)
    }
  },

  async updateAddress(req, res, next) {
    try {
      const updated = await userModel.updateAddress(req.user.id, req.params.id, req.body)
      return sendSuccess(res, updated, 'Address updated successfully')
    } catch (err) {
      next(err)
    }
  },

  async deleteAddress(req, res, next) {
    try {
      await userModel.deleteAddress(req.user.id, req.params.id)
      return sendSuccess(res, null, 'Address deleted successfully')
    } catch (err) {
      next(err)
    }
  },

  async getPreferences(req, res, next) {
    try {
      const prefs = await userModel.getPreferences(req.user.id)
      return sendSuccess(res, prefs, 'Preferences retrieved')
    } catch (err) {
      next(err)
    }
  },

  async updatePreferences(req, res, next) {
    try {
      const updated = await userModel.updatePreferences(req.user.id, req.body)
      return sendSuccess(res, updated, 'Preferences updated successfully')
    } catch (err) {
      next(err)
    }
  }
}
