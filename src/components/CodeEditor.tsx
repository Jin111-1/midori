'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Editor from '@monaco-editor/react'
import { 
  Play, 
  Save, 
  Download, 
  ArrowLeft, 
  Bot, 
  Sparkles,
  Eye,
  Code,
  Split
} from 'lucide-react'

interface Draft {
  id: string
  code: string
  prompt: string
  created_at: string
  is_saved: boolean
}

export function CodeEditor() {
  const searchParams = useSearchParams()
  const promptParam = searchParams.get('prompt')
  const projectParam = searchParams.get('project')
  
  const [code, setCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDraft, setIsDraft] = useState(true)
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (promptParam && !projectParam) {
      // Generate code from prompt
      generateCodeFromPrompt(promptParam)
    }
    // TODO: Load existing project if projectParam is provided
  }, [promptParam, projectParam])

  const generateCodeFromPrompt = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()
      
      if (data.code) {
        setCode(data.code)
        
        // Create a new draft
        const draft: Draft = {
          id: Date.now().toString(),
          code: data.code,
          prompt,
          created_at: new Date().toISOString(),
          is_saved: false
        }
        setCurrentDraft(draft)
        
        // Save draft to localStorage
        const drafts = JSON.parse(localStorage.getItem('midori_drafts') || '[]')
        drafts.push(draft)
        localStorage.setItem('midori_drafts', JSON.stringify(drafts))
      }
    } catch (error) {
      console.error('Error generating code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(code)
        iframeDoc.close()
      }
    }
  }

  useEffect(() => {
    if (code) {
      updatePreview()
    }
  }, [code])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      setIsDraft(true)
      
      // Update current draft
      if (currentDraft) {
        const updatedDraft = { ...currentDraft, code: value }
        setCurrentDraft(updatedDraft)
        
        // Update in localStorage
        const drafts = JSON.parse(localStorage.getItem('midori_drafts') || '[]')
        const draftIndex = drafts.findIndex((d: Draft) => d.id === currentDraft.id)
        if (draftIndex >= 0) {
          drafts[draftIndex] = updatedDraft
          localStorage.setItem('midori_drafts', JSON.stringify(drafts))
        }
      }
    }
  }

  const saveDraft = () => {
    if (currentDraft) {
      const updatedDraft = { ...currentDraft, is_saved: true }
      setCurrentDraft(updatedDraft)
      setIsDraft(false)
      
      // Update in localStorage
      const drafts = JSON.parse(localStorage.getItem('midori_drafts') || '[]')
      const draftIndex = drafts.findIndex((d: Draft) => d.id === currentDraft.id)
      if (draftIndex >= 0) {
        drafts[draftIndex] = updatedDraft
        localStorage.setItem('midori_drafts', JSON.stringify(drafts))
      }
      
      // TODO: Save to actual database
      console.log('Draft saved!')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'website.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const goHome = () => {
    window.location.href = '/'
  }

  const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 1rem;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Your Website!</h1>
        <p>This is a beautiful starting point created by Midori. Edit the code to customize your website!</p>
    </div>
</body>
</html>`

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={goHome}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              M
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Code Editor</h1>
              {currentDraft && (
                <p className="text-sm text-gray-500">
                  {isDraft ? '📝 Unsaved draft' : '✅ Saved'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('code')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'code' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            <Code size={16} />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'split' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            <Split size={16} />
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'preview' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            <Eye size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={saveDraft}
            disabled={!isDraft}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} className="mr-2" />
            Save
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
            {isGenerating ? (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your website...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
                </div>
              </div>
            ) : (
              <Editor
                height="100%"
                defaultLanguage="html"
                value={code || defaultCode}
                onChange={handleEditorChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
          </div>
        )}

        {/* Live Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} bg-white`}>
            <div className="h-full flex flex-col">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center">
                <Play size={16} className="mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Live Preview</span>
              </div>
              <iframe
                ref={iframeRef}
                className="flex-1 w-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}