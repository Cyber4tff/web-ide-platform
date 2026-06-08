'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useProjectStore } from '@/store/projects'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { projects, setProjects, addProject } = useProjectStore()
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/api/projects')
        if (response.success) {
          setProjects(response.data.projects)
        }
      } catch (error) {
        toast.error('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user, setProjects])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.post('/api/projects', formData)
      if (response.success) {
        addProject(response.data)
        setFormData({ name: '', description: '' })
        setShowCreateForm(false)
        toast.success('Project created successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project')
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
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Projects</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
          >
            New Project
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateProject} className="mb-8 p-6 bg-dark-900 rounded-lg border border-gray-700">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/editor/${project.id}`}
                className="p-6 bg-dark-900 rounded-lg border border-gray-700 hover:border-blue-500 transition cursor-pointer group"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">{project.name}</h3>
                <p className="text-gray-400 text-sm mt-2">{project.description || 'No description'}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gray-500 text-xs">Modified: {new Date(project.updatedAt).toLocaleDateString()}</span>
                  {project.isPublic && <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">Public</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
