import { productModel } from '../models/productModel.js'
import { aiImageService } from '../services/aiImageService.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const aiPreviewController = {
  /**
   * Handles POST /api/ai/product-preview
   */
  async generateProductPreview(req, res, next) {
    try {
      const { productId, height, weight, bodyShape } = req.body

      if (!productId) {
        return sendError(res, 'Product ID is required.', 400, 'MISSING_PRODUCT_ID')
      }

      const numHeight = Number(height)
      const numWeight = Number(weight)

      if (isNaN(numHeight) || numHeight < 100 || numHeight > 240) {
        return sendError(res, 'Please provide a valid height between 100 cm and 240 cm.', 400, 'INVALID_HEIGHT')
      }

      if (isNaN(numWeight) || numWeight < 30 || numWeight > 220) {
        return sendError(res, 'Please provide a valid weight between 30 kg and 220 kg.', 400, 'INVALID_WEIGHT')
      }

      // 1. Retrieve the selected product from MySQL database
      const product = await productModel.getByIdOrSlug(productId)
      if (!product) {
        return sendError(res, `Product with ID "${productId}" not found.`, 404, 'PRODUCT_NOT_FOUND')
      }

      // 2. Extract reference image
      const images = Array.isArray(product.images)
        ? product.images
        : typeof product.images === 'string'
        ? JSON.parse(product.images)
        : []

      if (!images.length) {
        return sendError(res, 'Product does not have a reference image available for preview generation.', 400, 'NO_IMAGE_AVAILABLE')
      }

      // 3. Generate wear preview reference via AI image service
      const previewResult = await aiImageService.generateWearPreview({
        product,
        height: numHeight,
        weight: numWeight,
        bodyShape: bodyShape || 'balanced'
      })

      // 4. Return payload to frontend
      return sendSuccess(res, {
        previewUrl: previewResult.previewUrl,
        disclaimer: previewResult.disclaimer,
        isMock: previewResult.isMock,
        provider: previewResult.provider,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          image: images[0] || '',
          craft: product.technique,
          material: product.material,
          price: product.price,
          displayPrice: product.displayPrice
        },
        attributes: {
          height: numHeight,
          weight: numWeight,
          bodyShape: bodyShape || 'balanced'
        },
        createdAt: new Date().toISOString()
      }, 'AI Wear Preview generated successfully')
    } catch (err) {
      next(err)
    }
  }
}
