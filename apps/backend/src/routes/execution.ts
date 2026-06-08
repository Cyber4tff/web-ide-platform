import { Router } from 'express'
import { executeCode } from '../controllers/execution'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)
router.post('/', executeCode)

export default router
