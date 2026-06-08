import { Router } from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/auth'
import { authMiddleware } from '../middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)

export default router
