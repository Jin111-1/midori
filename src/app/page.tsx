import { MidoriChat } from '@/components/MidoriChat'
import { ProjectList } from '@/components/ProjectList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              M
            </div>
            <h1 className="text-4xl font-bold text-gray-800 ml-4">Midori</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your friendly AI companion for creating beautiful websites from simple prompts.
            Just describe your idea, and I'll help bring it to life!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Midori Chat Interface */}
          <div className="lg:col-span-2">
            <MidoriChat />
          </div>

          {/* Projects Sidebar */}
          <div className="lg:col-span-1">
            <ProjectList />
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Conversations</h3>
            <p className="text-gray-600">Midori understands your ideas and asks the right questions to clarify your vision.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              ⚡
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Preview</h3>
            <p className="text-gray-600">See your website come to life in real-time with our live preview editor.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              📝
            </div>
            <h3 className="text-lg font-semibold mb-2">Draft System</h3>
            <p className="text-gray-600">Every iteration is saved as a draft. Save only when you're completely satisfied.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
