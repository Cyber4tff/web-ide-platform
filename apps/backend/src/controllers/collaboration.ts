import { Request, Response } from 'express'
import { prisma } from '../utils/helpers'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['viewer', 'editor', 'admin']),
})

/**
 * Invite user to project
 */
export const inviteCollaborator = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId } = req.params
    const { email, role } = inviteSchema.parse(req.body)

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

    // Find user to invite
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!invitedUser) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    // Create collaboration
    const collaboration = await prisma.collaboration.upsert({
      where: {
        projectId_userId: { projectId, userId: invitedUser.id },
      },
      update: { role },
      create: {
        projectId,
        userId: invitedUser.id,
        role,
        invitedBy: userId,
      },
    })

    res.json({
      success: true,
      data: collaboration,
      message: 'Invitation sent',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to invite collaborator' })
  }
}

/**
 * Get project collaborators
 */
export const getCollaborators = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { projectId } = req.params
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const collaborations = await prisma.collaboration.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    })

    res.json({
      success: true,
      data: { collaborators: collaborations },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch collaborators' })
  }
}

/**
 * Remove collaborator from project
 */
export const removeCollaborator = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId, collaboratorId } = req.params

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

    await prisma.collaboration.delete({
      where: {
        projectId_userId: { projectId, userId: collaboratorId },
      },
    })

    res.json({
      success: true,
      message: 'Collaborator removed',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove collaborator' })
  }
}
