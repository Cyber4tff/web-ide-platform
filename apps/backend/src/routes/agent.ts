import { Router } from 'express'
import { runCodingAgent, getAgentSuggestions } from '../controllers/agent'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.post('/run', runCodingAgent)
router.post('/suggestions', getAgentSuggestions)

export default router
