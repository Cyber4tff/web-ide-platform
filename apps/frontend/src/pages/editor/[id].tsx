'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useEditorStore } from '@/store/editor'
import { apiClient } from '@/lib/api'
import CodeEditor from '@/components/Editor'
import Preview from '@/components/Preview'
import AIAssistant from '@/components/AIAssistant'
import CodingAgent from '@/components/CodingAgent'
import DeploymentPanel from '@/components/DeploymentPanel'
import CollaborationPanel from '@/components/CollaborationPanel'
import toast from 'react-hot-toast'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { code, setCode, setOutput, language, isExecuting, setExecuting } = useEditorStore()
  const [projectId] = useState(params?.id)
  const [files, setFiles] = useState<any[]>([])
  const [currentFile, setCurrentFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [showAgent, setShowAgent] = useState(false)
  const [showDeploy, setShowDeploy] = useState(false)
  const [showCollaborate, setShowCollaborate] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Fetch project files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await apiClient.get(`/api/projects/${projectId}/files`)
        if (response.success) {
          setFiles(response.data.files)
          if (response.data.files.length > 0) {
            setCurrentFile(response.data.files[0])
            setCode(response.data.files[0].content || '')
          }
        }
      } catch (error) {
        toast.error('Failed to load files')
      } finally {
        setLoading(false)
      }
    }

    if (projectId && user) {
      fetchFiles()
    }
  }, [projectId, user, setCode])

  const handleSaveFile = async () => {
    if (!currentFile) return

    try {
      const response = await apiClient.put(
        `/api/projects/${projectId}/files/${currentFile.id}`,
        { content: code }
      )
      if (response.success) {
        toast.success('File saved!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save file')
    }
  }

  const handleExecute = async () => {
    setExecuting(true)
    try {
      const response = await apiClient.post('/api/execute', {
        code,
        language: currentFile?.language || 'javascript',
        timeout: 5000,
      })

      if (response.success) {
        setOutput(response.data.output || response.data.error || '')
      }
    } catch (error: any) {
      setOutput(error.message || 'Execution failed')
    } finally {
      setExecuting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-dark-950 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="bg-dark-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>
          <h1 className="text-white font-semibold">{currentFile?.name || 'Untitled'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAI(!showAI)}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            ✨ AI
          </button>
          <button
            onClick={() => setShowAgent(!showAgent)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            🤖 Agent
          </button>
          <button
            onClick={() => setShowDeploy(!showDeploy)}
            className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
          >
            🚀 Deploy
          </button>
          <button
            onClick={() => setShowCollaborate(!showCollaborate)}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            👥 Share
          </button>
          <button
            onClick={handleSaveFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Save
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            {isExecuting ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Left Sidebar */}
        <div className="w-64 bg-dark-900 rounded-lg border border-gray-700 overflow-auto p-4">
          <h3 className="text-white font-semibold mb-4">Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => {
                  setCurrentFile(file)
                  setCode(file.content || '')
                }}
                className={`w-full text-left px-3 py-2 rounded transition ${
                  currentFile?.id === file.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 min-w-0">
            <CodeEditor fileName={currentFile?.name} />
          </div>
          <div className="flex-1 min-w-0">
            <Preview isLoading={isExecuting} />
          </div>
        </div>

        {/* Right Sidebar - AI/Features */}
        {(showAI || showAgent || showDeploy || showCollaborate) && (
          <div className="w-96 overflow-auto space-y-4">
            {showAI && <AIAssistant code={code} language={language} />}
            {showAgent && <CodingAgent onCodeGenerated={setCode} />}
            {showDeploy && <DeploymentPanel projectId={projectId as string} />}
            {showCollaborate && <CollaborationPanel projectId={projectId as string} />}
          </div>
        )}
      </div>
    </div>
  )
}
