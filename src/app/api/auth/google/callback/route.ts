import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=no_code`)
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user information
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()

    // Create JWT token with user info
    const jwtToken = jwt.sign(
      {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        verified_email: userInfo.verified_email
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Set cookie
    const cookie = serialize('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // Redirect to user page
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/user`)
    response.headers.set('Set-Cookie', cookie)
    
    return response

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_failed`)
  }
}