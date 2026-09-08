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

  /**
   * Public-Safe Artisan Story Endpoint
   * Returns curated public artisan story and associated handloom creations.
   * Strictly excludes private credentials, user data, or unverified claims.
   */
  async getArtisanStory(req, res, next) {
    try {
      const { id } = req.params
      if (!id || typeof id !== 'string' || !id.trim()) {
        return sendError(res, 'Valid artisan ID is required', 400, 'INVALID_ARTISAN_ID')
      }

      const artisan = await artisanModel.getById(id.trim())
      if (!artisan) {
        return sendError(res, `Artisan with ID "${id}" not found.`, 404, 'ARTISAN_NOT_FOUND')
      }

      const products = await productModel.getProductsByArtisanId(artisan.id)

      // Explicit public response shape strictly preserving data boundaries
      const publicArtisan = {
        id: String(artisan.id),
        name: String(artisan.name),
        title: artisan.title ? String(artisan.title) : null,
        region: String(artisan.region),
        craft: String(artisan.craft),
        specialty: artisan.specialty ? String(artisan.specialty) : null,
        experience: String(artisan.experience),
        bio: artisan.bio ? String(artisan.bio) : null,
        story: artisan.story ? String(artisan.story) : null,
        techniques: Array.isArray(artisan.techniques) ? artisan.techniques.map(String) : [],
        culturalBackground: artisan.culturalBackground ? String(artisan.culturalBackground) : null,
        communityImpact: artisan.communityImpact || null,
        image: String(artisan.image),
        isCollective: Boolean(artisan.isCollective),
        followerCount: Number(artisan.followerCount || 0),
        supportCount: Number(artisan.supportCount || 0)
      }

      const publicProducts = Array.isArray(products)
        ? products.map(p => ({
            id: String(p.id),
            name: String(p.name),
            slug: String(p.slug || p.id),
            price: Number(p.price),
            displayPrice: String(p.displayPrice || `₹${p.price}`),
            material: String(p.material),
            technique: String(p.technique),
            region: String(p.region),
            images: Array.isArray(p.images)
              ? p.images
              : typeof p.images === 'string'
              ? JSON.parse(p.images)
              : [],
            badge: p.badge ? String(p.badge) : null
          }))
        : []

      return sendSuccess(res, {
        artisan: publicArtisan,
        products: publicProducts,
        verifiedAt: new Date().toISOString()
      }, 'Artisan story retrieved successfully')
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
