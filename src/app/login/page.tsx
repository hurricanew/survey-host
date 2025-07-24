'use client'

import Link from 'next/link'

export default function Login() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with logo */}
      <header className="flex justify-center pt-16 pb-8">
        <Link href="/" className="block">
          <div className="text-green-600 text-5xl font-bold">
            One Click
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full">
        <div className="w-full">
          <h1 className="text-5xl font-bold text-black mb-4 leading-tight">
            Log in
          </h1>
          {/* Google Login Button */}
          <button 
            onClick={() => window.location.href = '/api/auth/google'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl border border-gray-200 flex items-center justify-center gap-3 mb-8 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Log in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Email Input */}
          <div className="mb-8">
            <input
              type="email"
              placeholder="Email"
              className="w-full text-lg py-4 px-0 border-0 border-b-2 bg-transparent focus:outline-none placeholder-gray-400"
              style={{borderBottomColor: '#1c5d8c'}}
            />
          </div>

          {/* Password Input */}
          <div className="mb-12">
            <input
              type="password"
              placeholder="Password"
              className="w-full text-lg py-4 px-0 border-0 border-b-2 bg-transparent focus:outline-none placeholder-gray-400"
              style={{borderBottomColor: '#1c5d8c'}}
            />
          </div>

          {/* Continue Button */}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-xl transition-colors text-lg">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}