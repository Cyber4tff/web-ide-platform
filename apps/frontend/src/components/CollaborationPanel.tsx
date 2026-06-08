'use client'

import { FC, useState } from 'react'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import { Users, Plus, Trash2 } from 'lucide-react'

interface CollaborationPanelProps {
  projectId: string
}

const CollaborationPanel: FC<CollaborationPanelProps> = ({ projectId }) => {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const [loading, setLoading] = useState(false)
  const [collaborators, setCollaborators] = useState<any[]>([])

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email')
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.post(`/api/collaborate/${projectId}/invite`, {
        email,
        role,
      })

      if (response.success) {
        setCollaborators([response.data, ...collaborators])
        setEmail('')
        toast.success('Invitation sent!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (collaboratorId: string) => {
    try {
      const response = await apiClient.delete(
        `/api/collaborate/${projectId}/collaborators/${collaboratorId}`
      )

      if (response.success) {
        setCollaborators(collaborators.filter((c) => c.userId !== collaboratorId))
        toast.success('Collaborator removed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove')
    }
  }

  return (
    <div className="bg-dark-900 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-green-500" />
        Collaborators
      </h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            className="flex-1 px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {collaborators.length > 0 && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">Team Members</h3>
          <div className="space-y-2">
            {collaborators.map((c) => (
              <div key={c.userId} className="flex items-center justify-between p-3 bg-dark-950 rounded">
                <div>
                  <p className="text-white font-semibold">{c.user?.name || c.email}</p>
                  <p className="text-gray-400 text-sm capitalize">{c.role}</p>
                </div>
                <button
                  onClick={() => handleRemove(c.userId)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollaborationPanel
