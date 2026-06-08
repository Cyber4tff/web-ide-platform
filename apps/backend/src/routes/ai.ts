import { Router } from 'express'
import { generateCode, suggestFix, reviewCode } from '../controllers/ai'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.post('/generate-code', generateCode)
router.post('/suggest-fix', suggestFix)
router.post('/review-code', reviewCode)

export default router
