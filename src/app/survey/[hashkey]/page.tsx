'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Survey {
  id: number
  hashkey: string
  title: string
  description: string
  questions: Question[]
}

interface Question {
  id: number
  question_number: number
  question_text: string
  options: AnswerOption[]
}

interface AnswerOption {
  id: number
  option_letter: string
  option_text: string
  option_value: number
}

export default function PublicSurveyPage() {
  const params = useParams()
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hashkey = params.hashkey as string

  const fetchSurvey = useCallback(async () => {
    try {
      const response = await fetch(`/api/surveys/${hashkey}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Survey not found')
        } else {
          setError('Failed to load survey')
        }
        return
      }

      const surveyData = await response.json()
      setSurvey(surveyData)
    } catch (error) {
      console.error('Error fetching survey:', error)
      setError('Failed to load survey')
    } finally {
      setIsLoading(false)
    }
  }, [hashkey])

  useEffect(() => {
    fetchSurvey()
  }, [fetchSurvey])


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Survey Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This survey does not exist or is no longer available.'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Home
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
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Survey Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600">{survey.description}</p>
          )}
          <div className="mt-4 text-sm text-gray-500">
            Survey ID: {survey.hashkey} • {survey.questions.length} questions
          </div>
        </div>

        <div className="space-y-8">
          {survey.questions.map((question) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {question.question_number}. {question.question_text}
              </h3>
              
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        {option.option_letter}
                      </span>
                    </div>
                    <span className="text-gray-700">{option.option_text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to create your own survey?</h3>
          <p className="text-blue-700 mb-4">
            Create surveys like this one in seconds with One Click&apos;s AI-powered survey generator.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </main>
    </div>
  )
}