'use client'

import { FC, useState } from 'react'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import { Wand2, AlertCircle, Lightbulb } from 'lucide-react'

interface AIAssistantProps {
  code: string
  language: string
}

const AIAssistant: FC<AIAssistantProps> = ({ code, language }) => {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showPanel, setShowPanel] = useState(false)

  const handleGenerateCode = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post('/api/ai/generate-code', {
        prompt: 'Create a function to handle user input',
        language,
      })
      if (response.success) {
        setSuggestions([response.data.code])
        toast.success('Code generated!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate code')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewCode = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post('/api/ai/review-code', {
        code,
        language,
      })
      if (response.success) {
        setSuggestions(response.data.suggestions)
        toast.success(`Code review completed: ${response.data.score}/100`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to review code')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestFix = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post('/api/ai/suggest-fix', {
        code,
        language,
        error: 'Unexpected token',
      })
      if (response.success) {
        setSuggestions([response.data.suggestion])
        toast.success('Suggestions provided!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to get suggestions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-900 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-500" />
          AI Assistant
        </h3>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="text-gray-400 hover:text-white"
        >
          {showPanel ? '−' : '+'}
        </button>
      </div>

      {showPanel && (
        <div className="space-y-3">
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Generate Code
          </button>

          <button
            onClick={handleReviewCode}
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Review Code
          </button>

          <button
            onClick={handleSuggestFix}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Suggest Fix
          </button>

          {suggestions.length > 0 && (
            <div className="bg-dark-950 rounded p-3 text-gray-300 text-sm max-h-40 overflow-auto">
              {suggestions.map((s, i) => (
                <p key={i} className="mb-2">
                  {s}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AIAssistant
