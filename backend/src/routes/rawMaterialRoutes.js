import { Router } from 'express'
import { body } from 'express-validator'
import { rawMaterialController } from '../controllers/rawMaterialController.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.get('/', rawMaterialController.getRawMaterials)
router.get('/:id', rawMaterialController.getRawMaterialDetail)

router.post(
  '/bulk-quote',
  [
    body('materialId').trim().notEmpty().withMessage('Material ID is required'),
    body('materialName').trim().notEmpty().withMessage('Material name is required'),
    body('requestedQty').isNumeric().withMessage('Valid quantity is required'),
    body('artisanName').trim().notEmpty().withMessage('Contact name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    validate
  ],
  rawMaterialController.submitBulkQuote
)

export default router
