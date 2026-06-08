'use client'

import { FC, useState } from 'react'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import { Rocket, CheckCircle, AlertCircle } from 'lucide-react'

interface DeploymentPanelProps {
  projectId: string
}

const DeploymentPanel: FC<DeploymentPanelProps> = ({ projectId }) => {
  const [host, setHost] = useState('vercel')
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deployments, setDeployments] = useState<any[]>([])

  const handleDeploy = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name')
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.post(`/api/deployments/${projectId}/deploy`, {
        host,
        projectName,
      })

      if (response.success) {
        setDeployments([response.data, ...deployments])
        setProjectName('')
        toast.success('Deployment started!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Deployment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-900 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Rocket className="w-6 h-6 text-orange-500" />
        Deploy Project
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Hosting Platform</label>
          <select
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          >
            <option value="vercel">Vercel</option>
            <option value="netlify">Netlify</option>
            <option value="railway">Railway</option>
            <option value="render">Render</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="my-awesome-app"
            className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleDeploy}
          disabled={loading}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Deploying...' : 'Deploy Now'}
        </button>
      </div>

      {deployments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">Recent Deployments</h3>
          <div className="space-y-2">
            {deployments.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-dark-950 rounded">
                <div>
                  <p className="text-white font-semibold">{d.name}</p>
                  <p className="text-gray-400 text-sm">{d.url}</p>
                </div>
                {d.status === 'deployed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : d.status === 'failed' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DeploymentPanel
