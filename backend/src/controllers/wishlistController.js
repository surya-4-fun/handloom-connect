import { wishlistModel } from '../models/wishlistModel.js'
import { sendSuccess } from '../utils/response.js'

export const wishlistController = {
  async getWishlist(req, res, next) {
    try {
      const [ids, products] = await Promise.all([
        wishlistModel.getWishlistIds(req.user.id),
        wishlistModel.getWishlistProducts(req.user.id)
      ])

      return sendSuccess(res, {
        wishlistIds: ids,
        products
      }, 'Wishlist retrieved')
    } catch (err) {
      next(err)
    }
  },

  async toggleWishlist(req, res, next) {
    try {
      const { productId } = req.body
      const result = await wishlistModel.toggleWishlist(req.user.id, productId)
      const ids = await wishlistModel.getWishlistIds(req.user.id)

      return sendSuccess(res, {
        ...result,
        wishlistIds: ids
      }, result.inWishlist ? 'Added to wishlist' : 'Removed from wishlist')
    } catch (err) {
      next(err)
    }
  }
}
