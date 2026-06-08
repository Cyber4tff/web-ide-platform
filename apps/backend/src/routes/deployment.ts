import { Router } from 'express'
import {
  deployProject,
  getDeploymentStatus,
  getDeployments,
} from '../controllers/deployment'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.post('/:projectId/deploy', deployProject)
router.get('/:deploymentId/status', getDeploymentStatus)
router.get('/:projectId/deployments', getDeployments)

export default router
