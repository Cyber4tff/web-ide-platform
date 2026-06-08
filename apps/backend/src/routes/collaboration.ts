import { Router } from 'express'
import {
  inviteCollaborator,
  getCollaborators,
  removeCollaborator,
} from '../controllers/collaboration'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.post('/:projectId/invite', inviteCollaborator)
router.get('/:projectId/collaborators', getCollaborators)
router.delete('/:projectId/collaborators/:collaboratorId', removeCollaborator)

export default router
