import { Router } from 'express'
import { artisanController } from '../controllers/artisanController.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', artisanController.getArtisans)
router.get('/user/followed', requireAuth, artisanController.getFollowed)
router.get('/:id', optionalAuth, artisanController.getArtisanDetail)
router.post('/:id/follow', requireAuth, artisanController.toggleFollow)
router.post('/:id/support', optionalAuth, artisanController.supportArtisan)

export default router
