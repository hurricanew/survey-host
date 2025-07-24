import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        verified_email: decoded.verified_email
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}