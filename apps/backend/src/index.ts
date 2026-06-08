import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'express-async-errors'
import dotenv from 'dotenv'
import pino from 'pino'

// Import routes
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import fileRoutes from './routes/files'
import executionRoutes from './routes/execution'
import deploymentRoutes from './routes/deployment'
import aiRoutes from './routes/ai'
import collaborationRoutes from './routes/collaboration'
import gitRoutes from './routes/git'
import agentRoutes from './routes/agent'

dotenv.config()

const app: Express = express()
const logger = pino()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
  })
  next()
})

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/execute', executionRoutes)
app.use('/api/deployments', deploymentRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/collaborate', collaborationRoutes)
app.use('/api/git', gitRoutes)
app.use('/api/agent', agentRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  })
})

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err)

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`)
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
