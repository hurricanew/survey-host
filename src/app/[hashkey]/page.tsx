'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

interface Survey {
  id: number
  hashkey: string
  title: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function SurveyPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hashkey = params.hashkey as string

  const fetchUserSurveys = useCallback(async () => {
    try {
      const response = await fetch(`/api/user-surveys`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No surveys found')
        } else {
          setError('Failed to load surveys')
        }
        return
      }

      const surveyData = await response.json()
      setSurveys(surveyData.surveys || [])
    } catch (error) {
      console.error('Error fetching surveys:', error)
      setError('Failed to load surveys')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    // Check if the hashkey belongs to the current user
    if (user.hashkey !== hashkey) {
      setError('Survey not found or access denied')
      setIsLoading(false)
      return
    }

    fetchUserSurveys()
  }, [user, loading, hashkey, router, fetchUserSurveys])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/create')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Create
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/')} className="flex items-center">
                <svg width="32" height="32" viewBox="0 0 200 200" className="mr-3">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="url(#gradient)" stroke="#1E40AF" strokeWidth="3"/>
                  <text x="100" y="120" textAnchor="middle" fontSize="120" fontWeight="bold" fill="white">1</text>
                </svg>
                <span className="text-xl font-bold text-gray-900">One Click</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Survey Dashboard Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Surveys</h1>
          <p className="text-gray-600">
            Manage and share your surveys created with One Click
          </p>
          <div className="mt-4 text-sm text-gray-500">
            User ID: {hashkey} • {surveys.length} survey{surveys.length !== 1 ? 's' : ''}
          </div>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first survey
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Survey
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {survey.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      survey.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {survey.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {survey.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {survey.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <div>Survey ID: {survey.hashkey}</div>
                    <div>Created: {new Date(survey.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/survey/${survey.hashkey}`)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Survey
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/survey/${survey.hashkey}`)
                        // TODO: Show toast notification
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Survey
          </button>
        </div>
      </main>
    </div>
  )
}