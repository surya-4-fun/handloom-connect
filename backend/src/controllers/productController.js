import { productModel } from '../models/productModel.js'
import { artisanModel } from '../models/artisanModel.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const productController = {
  async getProducts(req, res, next) {
    try {
      const {
        category,
        search,
        minPrice,
        maxPrice,
        materials,
        regions,
        techniques,
        artisanIds,
        inStockOnly,
        sort,
        page,
        limit
      } = req.query

      const filters = {
        category,
        search,
        minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
        materials: materials ? (Array.isArray(materials) ? materials : materials.split(',')) : [],
        regions: regions ? (Array.isArray(regions) ? regions : regions.split(',')) : [],
        techniques: techniques ? (Array.isArray(techniques) ? techniques : techniques.split(',')) : [],
        artisanIds: artisanIds ? (Array.isArray(artisanIds) ? artisanIds : artisanIds.split(',')) : [],
        inStockOnly: inStockOnly === 'true' || inStockOnly === true,
        sort: sort || 'featured',
        page: page || 1,
        limit: limit || null
      }

      const result = await productModel.getAll(filters)
      return sendSuccess(res, result, 'Products retrieved successfully')
    } catch (err) {
      next(err)
    }
  },

  async getProductDetail(req, res, next) {
    try {
      const { idOrSlug } = req.params
      const product = await productModel.getByIdOrSlug(idOrSlug)

      if (!product) {
        return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND')
      }

      const [artisan, passport, related] = await Promise.all([
        product.artisanId ? artisanModel.getById(product.artisanId) : null,
        productModel.getPassportByProductId(product.id),
        productModel.getRelated(product.id, product.category, product.region, 4)
      ])

      return sendSuccess(res, {
        product,
        artisan,
        passport,
        relatedProducts: related
      }, 'Product details retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getFacets(req, res, next) {
    try {
      const facets = await productModel.getFacets()
      return sendSuccess(res, facets, 'Facets retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getProduct360(req, res, next) {
    try {
      const { idOrSlug } = req.params
      const product = await productModel.getByIdOrSlug(idOrSlug)

      if (!product) {
        return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND')
      }

      const [images, passport, artisan] = await Promise.all([
        productModel.get360Images(product.id),
        productModel.getPassportByProductId(product.id),
        product.artisanId ? artisanModel.getById(product.artisanId) : null
      ])

      const hotspots = [
        {
          id: 'hotspot-zari',
          title: `${product.technique} Ornamentation`,
          description: `Authentic ${product.material} detailing crafted in ${product.region}.`,
          xPercent: 28,
          yPercent: 68,
          craftFacet: 'Surface Ornamentation'
        },
        {
          id: 'hotspot-weave',
          title: 'Warp & Weft Density',
          description: passport ? `Loom: ${passport.loomType} (${passport.weaveDensity})` : 'Master artisan handloom interlock.',
          xPercent: 52,
          yPercent: 42,
          craftFacet: 'Loom Structure'
        },
        {
          id: 'hotspot-heritage',
          title: 'GI Provenance & Origin',
          description: passport ? `Silk Mark: ${passport.silkMarkNo} · GI: ${passport.giRegistryNo}` : `Handcrafted in ${product.region}.`,
          xPercent: 74,
          yPercent: 24,
          craftFacet: 'Authenticity Guarantee'
        }
      ]

      return sendSuccess(res, {
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        has360: images.length > 0,
        images,
        craftDetails: {
          weave: product.technique,
          material: product.material,
          region: product.region,
          dimensions: product.dimensions,
          care: product.care
        },
        passport,
        artisan: artisan ? {
          id: artisan.id,
          name: artisan.name,
          title: artisan.title,
          region: artisan.region,
          craft: artisan.craft,
          image: artisan.image
        } : null,
        hotspots
      }, 'Product 360 images and craft context retrieved')
    } catch (err) {
      next(err)
    }
  },

  async getProductPassport(req, res, next) {
    try {
      const { idOrSlug } = req.params
      const product = await productModel.getByIdOrSlug(idOrSlug)

      if (!product) {
        return sendError(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND')
      }

      const passport = await productModel.getPassportByProductId(product.id)
      if (!passport) {
        return sendSuccess(res, null, 'Authenticity passport not available for this product')
      }

      return sendSuccess(res, passport, 'Authenticity passport retrieved')
    } catch (err) {
      next(err)
    }
  }
}
