import { NextRequest, NextResponse } from 'next/server'
import { SurveyService } from '@/services/surveyService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hashkey: string }> }
) {
  try {
    const { hashkey } = await params

    // Validate hashkey format (8-character hex)
    if (!/^[0-9a-f]{8}$/i.test(hashkey)) {
      return NextResponse.json(
        { error: 'Invalid survey ID format' },
        { status: 400 }
      )
    }

    // Get survey with all questions and options
    const survey = await SurveyService.getSurveyByHashkey(hashkey)

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(survey)

  } catch (error) {
    console.error('Error fetching survey:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}