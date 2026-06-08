import { Router } from 'express'
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projects'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', getProjects)
router.post('/', createProject)
router.get('/:id', getProjectById)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router
