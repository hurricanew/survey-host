import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { SurveyService } from '@/services/surveyService'

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
      email: string
      name: string
      hashkey: string
    }

    // Get all surveys created by this user
    const surveys = await SurveyService.getSurveysByCreator(decoded.userId)

    return NextResponse.json({
      success: true,
      surveys: surveys,
      count: surveys.length
    })

  } catch (error) {
    console.error('Error fetching user surveys:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}