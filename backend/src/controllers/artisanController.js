import { artisanModel } from '../models/artisanModel.js'
import { productModel } from '../models/productModel.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const artisanController = {
  async getArtisans(req, res, next) {
    try {
      const { search, region, tab } = req.query
      const artisans = await artisanModel.getAll({ search, region, tab })
      return sendSuccess(res, artisans, 'Artisans retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getArtisanDetail(req, res, next) {
    try {
      const { id } = req.params
      const artisan = await artisanModel.getById(id)

      if (!artisan) {
        return sendError(res, 'Artisan not found', 404, 'ARTISAN_NOT_FOUND')
      }

      const products = await productModel.getProductsByArtisanId(artisan.id)

      let isFollowing = false
      if (req.user?.id) {
        isFollowing = await artisanModel.isFollowing(req.user.id, artisan.id)
      }

      return sendSuccess(res, {
        artisan,
        products,
        isFollowing
      }, 'Artisan details retrieved')
    } catch (err) {
      next(err)
    }
  },

  async toggleFollow(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const result = await artisanModel.toggleFollow(userId, id)
      return sendSuccess(res, result, result.following ? 'Followed artisan' : 'Unfollowed artisan')
    } catch (err) {
      next(err)
    }
  },

  async getFollowed(req, res, next) {
    try {
      const userId = req.user.id
      const followedIds = await artisanModel.getFollowedArtisanIds(userId)
      return sendSuccess(res, followedIds, 'Followed artisan IDs retrieved')
    } catch (err) {
      next(err)
    }
  },

  async supportArtisan(req, res, next) {
    try {
      const { id } = req.params
      const { tier = 1200 } = req.body
      const result = await artisanModel.incrementSupport(id, tier)
      return sendSuccess(res, result, 'Artisan support recorded successfully')
    } catch (err) {
      next(err)
    }
  }
}
