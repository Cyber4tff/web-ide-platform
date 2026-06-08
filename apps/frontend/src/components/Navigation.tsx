'use client'

import { FC } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

const Navigation: FC = () => {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="bg-dark-950 border-b border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          <span className="text-white font-bold text-lg">WebIDE</span>
        </Link>

        {/* User Menu */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
