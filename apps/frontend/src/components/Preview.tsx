'use client'

import { FC, useEffect, useRef } from 'react'
import { useEditorStore } from '@/store/editor'

interface PreviewProps {
  isLoading?: boolean
}

const Preview: FC<PreviewProps> = ({ isLoading = false }) => {
  const { code, language, output, executionError } = useEditorStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (language === 'html' && iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(code)
        doc.close()
      }
    }
  }, [code, language])

  return (
    <div className="flex flex-col h-full bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-dark-950 px-4 py-2 border-b border-gray-700">
        <h3 className="text-gray-300 font-semibold">Preview</h3>
        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {language === 'html' ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white"
            sandbox={{
              allow: ['scripts', 'same-origin', 'forms'],
            } as any}
          />
        ) : (
          <div className="p-4 text-gray-300 font-mono text-sm overflow-auto h-full">
            {executionError ? (
              <div className="text-red-400">
                <p className="font-semibold">Error:</p>
                <p>{executionError}</p>
              </div>
            ) : output ? (
              <div className="whitespace-pre-wrap">{output}</div>
            ) : (
              <div className="text-gray-500">Run the code to see output...</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Preview
