'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="h-10">
          <Link href="/" className="block h-full">
            <Image 
              src="/logo.svg" 
              alt="SurveyHost Logo" 
              width={160}
              height={40}
              className="h-full w-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 px-4 py-2 hover:text-gray-900 transition-colors">
            Log In
          </Link>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 mt-12">
        {/* Search Bar Container */}
        <div className="rounded-full p-6 mb-16 w-full max-w-4xl" style={{backgroundColor: '#1c5d8c'}}>
          <div className="flex items-center gap-4">
            <div className="text-white text-xl font-medium flex-shrink-0">
              Has a survey/Quiz code?
            </div>
            <div className="flex-1 flex items-center bg-white rounded-full px-6 py-3">
              <span className="text-xl font-bold mr-2" style={{color: '#1c5d8c'}}>#</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter code here"
                className="flex-1 text-gray-700 text-lg outline-none bg-transparent"
              />
              <button className="text-white p-3 rounded-full ml-4" style={{backgroundColor: '#1c5d8c'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#164a6f'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c5d8c'}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl font-bold text-black text-center leading-tight max-w-6xl">
          The easiest way to make an interactive journey
        </h1>
      </div>
    </div>
  )
}