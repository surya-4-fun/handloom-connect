import { Router } from 'express'
import { body } from 'express-validator'
import { userController } from '../controllers/userController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.use(requireAuth)

router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)

router.get('/addresses', userController.getAddresses)
router.post(
  '/addresses',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
    validate
  ],
  userController.addAddress
)
router.put('/addresses/:id', userController.updateAddress)
router.delete('/addresses/:id', userController.deleteAddress)

router.get('/preferences', userController.getPreferences)
router.put('/preferences', userController.updatePreferences)

export default router
