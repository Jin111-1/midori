'use client'

import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'midori'
  content: string
  timestamp: Date
}

interface MidoriState {
  step: 'initial' | 'summarizing' | 'generating' | 'completed'
  summary?: string
  refinedPrompt?: string
}

export function MidoriChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'midori',
      content: "Hi! I'm Midori, your AI companion for creating websites. Tell me about the website you'd like to build, and I'll help you refine your idea before we start coding!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [midoriState, setMidoriState] = useState<MidoriState>({ step: 'initial' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (midoriState.step === 'initial') {
        // Step 1: Get Midori's summary and clarification
        setMidoriState({ step: 'summarizing' })
        
        const response = await fetch('/api/ai/midori', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input })
        })

        const data = await response.json()
        
        const midoriResponse: ChatMessage = {
          role: 'midori',
          content: data.summary,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, midoriResponse])
        setMidoriState({ 
          step: 'completed', 
          summary: data.summary, 
          refinedPrompt: data.refinedPrompt 
        })

      } else if (midoriState.step === 'completed') {
        // Continue conversation or start new project
        const response = await fetch('/api/ai/midori', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: input,
            context: messages.map(m => m.content).join('\n')
          })
        })

        const data = await response.json()
        
        const midoriResponse: ChatMessage = {
          role: 'midori',
          content: data.summary,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, midoriResponse])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: ChatMessage = {
        role: 'midori',
        content: "I'm sorry, I encountered an error. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startCodeGeneration = () => {
    if (midoriState.refinedPrompt) {
      // Navigate to editor with the refined prompt
      window.location.href = `/editor?prompt=${encodeURIComponent(midoriState.refinedPrompt)}`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
          M
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">Midori</h3>
          <p className="text-sm text-gray-500">
            {midoriState.step === 'initial' && 'Ready to help you create'}
            {midoriState.step === 'summarizing' && 'Analyzing your idea...'}
            {midoriState.step === 'generating' && 'Generating code...'}
            {midoriState.step === 'completed' && 'Ready to build your website!'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
              <div className="p-3 bg-gray-100 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Code Button */}
      {midoriState.step === 'completed' && midoriState.refinedPrompt && (
        <div className="p-4 border-t bg-green-50">
          <button
            onClick={startCodeGeneration}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ✨ Generate Website Code
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the website you want to create..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}