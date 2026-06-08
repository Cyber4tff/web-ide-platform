'use client'

import { FC, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/store/editor'

interface EditorProps {
  fileName?: string
}

const CodeEditor: FC<EditorProps> = ({ fileName = 'index.js' }) => {
  const { code, language, setCode, setLanguage } = useEditorStore()

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value) setCode(value)
    },
    [setCode]
  )

  const getLanguageFromFileName = (name: string): string => {
    const ext = name.split('.').pop()
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
    }
    return languageMap[ext || 'js'] || 'javascript'
  }

  return (
    <div className="flex flex-col h-full bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-dark-950 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-mono">{fileName}</span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-dark-900 text-gray-300 text-sm px-2 py-1 rounded border border-gray-700 hover:border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
        </select>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          value={code}
          onChange={handleEditorChange}
          language={language}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Fira Code, monospace',
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
