import { Router } from 'express'
import {
  initGitRepo,
  commitChanges,
  getCommitHistory,
} from '../controllers/git'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.post('/:projectId/init', initGitRepo)
router.post('/:projectId/commit', commitChanges)
router.get('/:projectId/history', getCommitHistory)

export default router
