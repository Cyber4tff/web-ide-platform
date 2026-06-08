import { Request, Response } from 'express'
import { prisma } from '../utils/helpers'
import { generateSlug } from '../utils/helpers'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
})

/**
 * Get all projects for user
 */
export const getProjects = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { page = 1, limit = 10 } = req.query

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId, deletedAt: null },
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          isPublic: true,
          viewsCount: true,
          likesCount: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where: { userId, deletedAt: null } }),
    ])

    res.json({
      success: true,
      data: {
        projects,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch projects' })
  }
}

/**
 * Create a new project
 */
export const createProject = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { name, description, isPublic } = createProjectSchema.parse(req.body)

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const slug = generateSlug(name)

    const project = await prisma.project.create({
      data: {
        name,
        description,
        isPublic,
        slug,
        userId,
      },
    })

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed' })
    }
    res.status(500).json({ success: false, error: 'Failed to create project' })
  }
}

/**
 * Get project by ID
 */
export const getProjectById = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { userId }, // User's own project
          { isPublic: true }, // Public project
        ],
      },
      include: {
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            language: true,
            orderIndex: true,
          },
        },
      },
    })

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }

    res.json({ success: true, data: project })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch project' })
  }
}

/**
 * Update project
 */
export const updateProject = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId
    const { name, description, isPublic, tags } = req.body

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { id, userId },
    })

    if (!project) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
        ...(tags && { tags }),
      },
    })

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update project' })
  }
}

/**
 * Delete project
 */
export const deleteProject = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { id, userId },
    })

    if (!project) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    res.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete project' })
  }
}
