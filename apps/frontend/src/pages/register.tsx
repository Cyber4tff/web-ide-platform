'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.post('/api/auth/register', formData)
      
      if (response.success) {
        setUser(response.data)
        setToken(response.data.token)
        apiClient.setToken(response.data.token)
        toast.success('Registration successful!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-900 rounded-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password (min 8 characters)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-dark-950 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-gray-400 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-400">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
