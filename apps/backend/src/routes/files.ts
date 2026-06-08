import { Router } from 'express'
import { getFiles, createFile, updateFile, deleteFile } from '../controllers/files'
import { authMiddleware } from '../middleware'

const router = Router()

router.use(authMiddleware)

router.get('/:projectId/files', getFiles)
router.post('/:projectId/files', createFile)
router.put('/:projectId/files/:fileId', updateFile)
router.delete('/:projectId/files/:fileId', deleteFile)

export default router
