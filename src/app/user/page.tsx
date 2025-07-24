'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserInfo {
  id: string
  email: string
  name: string
  picture: string
  verified_email: boolean
}

export default function UserPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setError('Failed to fetch user information')
      }
    } catch (err) {
      setError('Error fetching user information')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error || 'Please log in to access this page'}</p>
          <Link 
            href="/login" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href="/" className="text-green-600 text-2xl font-bold">
            One Click
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <img
              src={user.picture}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-green-100">{user.email}</p>
          </div>

          {/* User Information */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Google ID
                  </label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg font-mono text-sm">
                    {user.id}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {user.email}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Verification Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.verified_email 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.verified_email ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-4">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div>
                  <p className="text-sm text-gray-600">
                    Profile picture from Google account
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    URL: {user.picture}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
              <Link
                href="/"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}