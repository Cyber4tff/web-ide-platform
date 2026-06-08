import { Request, Response } from 'express'
import { prisma, hashPassword, comparePassword, generateToken } from '../utils/helpers'
import { z } from 'zod'

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      },
      message: 'User registered successfully',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      })
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
    })
  }
}

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Generate token
    const token = generateToken(user.id)

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      },
      message: 'Login successful',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
      })
    }

    res.status(500).json({
      success: false,
      error: 'Login failed',
    })
  }
}

/**
 * Get user profile
 */
export const getProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
    })
  }
}

/**
 * Update user profile
 */
export const updateProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { name, bio, avatar } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
      },
    })

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    })
  }
}
