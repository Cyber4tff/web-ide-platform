import { Request, Response } from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import { z } from 'zod'

const execAsync = promisify(exec)

const executionSchema = z.object({
  code: z.string(),
  language: z.enum(['javascript', 'python', 'bash']),
  timeout: z.number().optional().default(5000),
})

/**
 * Execute code in sandbox
 */
export const executeCode = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId
    const { code, language, timeout } = executionSchema.parse(req.body)

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    let command = ''
    let output = ''
    let error = ''

    try {
      // Execute based on language
      switch (language) {
        case 'javascript':
          ;({ stdout: output, stderr: error } = await execAsync(`node -e "${code.replace(/"/g, '\\"')}"`, {
            timeout,
          }))
          break
        case 'python':
          ;({ stdout: output, stderr: error } = await execAsync(`python3 -c "${code.replace(/"/g, '\\"')}"`, {
            timeout,
          }))
          break
        case 'bash':
          ;({ stdout: output, stderr: error } = await execAsync(code, { timeout }))
          break
      }
    } catch (err: any) {
      error = err.message
    }

    res.json({
      success: true,
      data: {
        output: output || '',
        error: error || '',
        status: error ? 'error' : 'success',
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation failed' })
    }
    res.status(500).json({ success: false, error: 'Execution failed' })
  }
}
