import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserService } from '@/services/userService'
import { serialize } from 'cookie'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    // Decode existing token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
      name: string
    }

    // Get fresh user data from database
    const user = await UserService.findUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create new JWT token with complete user data including hashkey
    const newToken = jwt.sign(
      {
        id: user.google_id || decoded.email,
        email: user.email,
        name: user.name,
        picture: user.picture,
        verified_email: user.verified_email,
        userId: user.id,
        hashkey: user.hashkey // Ensure hashkey is included
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Set new cookie
    const cookie = serialize('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      user: {
        id: user.google_id || decoded.email,
        email: user.email,
        name: user.name,
        picture: user.picture,
        verified_email: user.verified_email,
        userId: user.id,
        hashkey: user.hashkey
      }
    })
    
    response.headers.set('Set-Cookie', cookie)
    return response

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}