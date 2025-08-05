'use client'

import { Suspense } from 'react'
import { CodeEditor } from '@/components/CodeEditor'

function EditorPageContent() {
  return (
    <div className="h-screen bg-gray-100">
      <CodeEditor />
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorPageContent />
    </Suspense>
  )
}