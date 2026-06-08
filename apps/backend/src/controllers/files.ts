import { Request, Response } from 'express'
import { prisma } from '../utils/helpers'
import { z } from 'zod'

const createFileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string(),
  content: z.string().optional(),
  language: z.string().optional(),
})

/**
 * Get project files
 */
export const getFiles = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { projectId } = req.params
    const userId = req.userId

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

    const files = await prisma.file.findMany({
      where: { projectId },
      orderBy: { orderIndex: 'asc' },
    })

    res.json({
      success: true,
      data: { files },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch files' })
  }
}

/**
 * Create file
 */
export const createFile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { projectId } = req.params
    const userId = req.userId
    const { name, type, content, language } = createFileSchema.parse(req.body)

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

    const maxOrder = await prisma.file.findFirst({
      where: { projectId },
      orderBy: { orderIndex: 'desc' },
    })

    const file = await prisma.file.create({
      data: {
        name,
        type,
        content: content || '',
        language,
        projectId,
        sizeBytes: content?.length || 0,
        orderIndex: (maxOrder?.orderIndex || 0) + 1,
      },
    })

    res.status(201).json({
      success: true,
      data: file,
      message: 'File created successfully',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed' })
    }
    res.status(500).json({ success: false, error: 'Failed to create file' })
  }
}

/**
 * Update file
 */
export const updateFile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { projectId, fileId } = req.params
    const userId = req.userId
    const { content, name } = req.body

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

    const file = await prisma.file.update({
      where: { id: fileId },
      data: {
        ...(content !== undefined && { content, sizeBytes: content.length }),
        ...(name && { name }),
      },
    })

    res.json({
      success: true,
      data: file,
      message: 'File updated successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update file' })
  }
}

/**
 * Delete file
 */
export const deleteFile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { projectId, fileId } = req.params
    const userId = req.userId

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

    await prisma.file.delete({
      where: { id: fileId },
    })

    res.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete file' })
  }
}
