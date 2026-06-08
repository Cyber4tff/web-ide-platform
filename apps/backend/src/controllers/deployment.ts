import { Request, Response } from 'express'
import { prisma } from '../utils/helpers'
import axios from 'axios'
import { z } from 'zod'

const deploySchema = z.object({
  host: z.enum(['vercel', 'netlify', 'railway', 'render']),
  projectName: z.string(),
  environment: z.record(z.string()).optional(),
})

/**
 * Deploy project
 */
export const deployProject = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId } = req.params
    const { host, projectName, environment } = deploySchema.parse(req.body)

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

    // Get project files
    const files = await prisma.file.findMany({
      where: { projectId },
    })

    // Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        userId,
        name: projectName,
        host,
        url: `https://${projectName}.${getDomain(host)}`,
        status: 'building',
        environment: environment || {},
      },
    })

    // TODO: Implement actual deployment to hosting service
    // For now, just simulate the deployment
    setTimeout(async () => {
      await prisma.deployment.update({
        where: { id: deployment.id },
        data: { status: 'deployed', deployedAt: new Date() },
      })
    }, 3000)

    res.json({
      success: true,
      data: deployment,
      message: 'Deployment started',
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Deployment failed' })
  }
}

/**
 * Get deployment status
 */
export const getDeploymentStatus = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { deploymentId } = req.params

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const deployment = await prisma.deployment.findFirst({
      where: {
        id: deploymentId,
        userId,
      },
    })

    if (!deployment) {
      return res.status(404).json({ success: false, error: 'Deployment not found' })
    }

    res.json({
      success: true,
      data: deployment,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch deployment status' })
  }
}

/**
 * Get project deployments
 */
export const getDeployments = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { projectId } = req.params

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const deployments = await prisma.deployment.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      success: true,
      data: { deployments },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch deployments' })
  }
}

function getDomain(host: string): string {
  const domains: Record<string, string> = {
    vercel: 'vercel.app',
    netlify: 'netlify.app',
    railway: 'railway.app',
    render: 'render.com',
  }
  return domains[host] || 'app.io'
}
