'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function CreatePage() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // useAuth hook handles redirect to login
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link href="/" className="text-green-600 text-2xl font-bold">
            One Click
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 text-sm">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Illustration Container */}
          <div className="relative mb-12">
            <div className="bg-gray-50 rounded-3xl p-16 mb-8 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-8 left-8 w-20 h-16 bg-gray-200 rounded-lg opacity-30"></div>
              <div className="absolute top-8 right-8 w-16 h-12 bg-gray-200 rounded-lg opacity-30"></div>
              
              {/* Main Illustration */}
              <div className="relative flex items-center justify-center">
                {/* Plant */}
                <div className="absolute left-12">
                  <div className="w-8 h-12 bg-gray-300 rounded-b-full"></div>
                  <div className="relative -top-6">
                    <div className="w-3 h-8 bg-green-500 mx-auto rounded-full"></div>
                    <div className="absolute -top-4 left-1 w-2 h-6 bg-green-500 rounded-full transform rotate-12"></div>
                    <div className="absolute -top-4 right-1 w-2 h-6 bg-green-500 rounded-full transform -rotate-12"></div>
                  </div>
                </div>

                {/* Person and Laptop */}
                <div className="flex items-center">
                  {/* Laptop */}
                  <div className="relative">
                    <div className="w-24 h-16 bg-white border-2 border-gray-300 rounded-lg relative">
                      <div className="absolute top-2 left-2 right-2 bottom-2 bg-gray-100 rounded"></div>
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="w-28 h-2 bg-gray-300 rounded-b-lg -mt-1"></div>
                  </div>

                  {/* Person */}
                  <div className="ml-4">
                    {/* Head */}
                    <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full mb-2 relative">
                      <div className="absolute top-2 left-3 w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="absolute top-2 right-3 w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-400 rounded-full"></div>
                      {/* Hair */}
                      <div className="absolute -top-1 left-2 right-2 h-4 bg-gray-300 rounded-t-full"></div>
                    </div>
                    {/* Body */}
                    <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>

                {/* Plus Button */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <button className="w-20 h-20 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center text-4xl font-light transition-colors shadow-lg">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Create
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Run polls and Q&A in your browser.
          </p>

          {/* Action Button */}
          <button className="bg-green-600 hover:bg-green-700 text-white text-xl font-medium py-4 px-12 rounded-xl transition-colors shadow-lg hover:shadow-xl">
            Start Creating
          </button>
        </div>
      </main>
    </div>
  )
}