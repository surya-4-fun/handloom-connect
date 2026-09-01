import { Router } from 'express'
import { productController } from '../controllers/productController.js'

const router = Router()

router.get('/', productController.getProducts)
router.get('/meta/facets', productController.getFacets)
router.get('/:idOrSlug/360', productController.getProduct360)
router.get('/:idOrSlug', productController.getProductDetail)

export default router
