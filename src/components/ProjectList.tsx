'use client'

import { useState, useEffect } from 'react'
import { Plus, FolderOpen, Clock, Code } from 'lucide-react'

interface Project {
  id: string
  name: string
  created_at: string
  last_modified?: string
  preview?: string
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      // For now, load from localStorage as a demo
      const storedProjects = localStorage.getItem('midori_projects')
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects))
      } else {
        // Demo projects
        const demoProjects: Project[] = [
          {
            id: '1',
            name: 'Portfolio Website',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            preview: 'Personal portfolio with React components'
          },
          {
            id: '2',
            name: 'Landing Page',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            preview: 'Modern landing page for SaaS product'
          }
        ]
        setProjects(demoProjects)
        localStorage.setItem('midori_projects', JSON.stringify(demoProjects))
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewProject = () => {
    // For now, just scroll to the chat interface
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openProject = (projectId: string) => {
    window.location.href = `/editor?project=${projectId}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <FolderOpen size={20} className="mr-2" />
          Your Projects
        </h3>
        <button
          onClick={createNewProject}
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
          title="Create new project"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Code size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="mb-2">No projects yet</p>
            <p className="text-sm">Start by describing your website idea to Midori!</p>
          </div>
        ) : (
          <div className="p-2">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => openProject(project.id)}
                className="p-3 mb-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                      {project.name}
                    </h4>
                    {project.preview && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {project.preview}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <Clock size={12} className="mr-1" />
                      {formatDate(project.created_at)}
                    </div>
                  </div>
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Code size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 text-center">
          💡 Tip: All drafts are automatically saved locally until you save them to your account
        </div>
      </div>
    </div>
  )
}