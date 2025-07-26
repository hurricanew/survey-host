import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Record<string, unknown>
    
    return NextResponse.json({
      decoded: decoded,
      hasHashkey: !!decoded.hashkey,
      tokenFields: Object.keys(decoded)
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 })
  }
}