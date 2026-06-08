import { Request, Response } from 'express'
import { prisma } from '../utils/helpers'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

/**
 * Create git repository
 */
export const initGitRepo = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId } = req.params

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    })

    if (!project) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    // TODO: Initialize git repository
    res.json({
      success: true,
      message: 'Git repository initialized',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to init git' })
  }
}

/**
 * Commit changes
 */
export const commitChanges = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId } = req.params
    const { message } = req.body

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // TODO: Commit to git repository
    res.json({
      success: true,
      message: `Changes committed: "${message}"`,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to commit' })
  }
}

/**
 * Get commit history
 */
export const getCommitHistory = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId } = req.params

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // TODO: Get commit history from git
    const commits = [
      {
        id: '1',
        message: 'Initial commit',
        author: 'You',
        date: new Date(),
      },
    ]

    res.json({
      success: true,
      data: { commits },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' })
  }
}
