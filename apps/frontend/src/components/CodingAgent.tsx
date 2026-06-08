'use client'

import { FC, useState } from 'react'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import { Bot, Loader } from 'lucide-react'

interface CodingAgentProps {
  onCodeGenerated?: (code: string) => void
}

const CodingAgent: FC<CodingAgentProps> = ({ onCodeGenerated }) => {
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleRunAgent = async () => {
    if (!task.trim()) {
      toast.error('Please describe the task')
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.post('/api/agent/run', {
        task,
      })

      if (response.success) {
        setResult(response.data.result)
        if (onCodeGenerated) {
          onCodeGenerated(response.data.result.code)
        }
        toast.success('Task completed!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Agent execution failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-900 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Bot className="w-6 h-6 text-blue-500" />
        Coding Agent
      </h2>

      <p className="text-gray-400 mb-4">
        Describe what you want to build, and the AI agent will help you write the code.
      </p>

      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="E.g., Create a function that validates email addresses..."
        className="w-full px-4 py-3 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 mb-4 resize-none h-24"
      />

      <button
        onClick={handleRunAgent}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Bot className="w-4 h-4" />
            Run Agent
          </>
        )}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-dark-950 rounded border border-blue-500">
          <h3 className="text-white font-semibold mb-2">Result:</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p className="font-semibold">Steps:</p>
            <ul className="list-disc list-inside space-y-1">
              {result.steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="mt-3">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodingAgent
