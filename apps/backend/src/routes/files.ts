import { Router, Request, Response } from 'express'

const router = Router()

/**
 * @route   GET /api/projects/:id/files
 * @desc    Get project files
 * @access  Protected
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        files: [],
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch files',
    })
  }
})

export default router
