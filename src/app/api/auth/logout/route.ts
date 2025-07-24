import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  // Clear the auth cookie
  const cookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/'
  })

  const response = NextResponse.json({ message: 'Logged out successfully' })
  response.headers.set('Set-Cookie', cookie)
  
  return response
}