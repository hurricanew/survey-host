import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserService } from '@/services/userService'
import { SurveyService, CreateSurveyData } from '@/services/surveyService'

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface ParsedSurvey {
  title: string
  description: string
  questions: Array<{
    question_text: string
    options: Array<{
      option_letter: string
      option_text: string
    }>
  }>
}

export async function POST(request: NextRequest) {
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

    console.log('Decoded JWT token:', { 
      userId: decoded.userId, 
      hashkey: decoded.hashkey,
      email: decoded.email 
    })

    const user = await UserService.findUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Found user in database:', { 
      id: user.id, 
      hashkey: user.hashkey, 
      email: user.email 
    })

    // Parse form data
    const formData = await request.formData()
    const surveyName = formData.get('surveyName') as string
    const file = formData.get('file') as File

    if (!surveyName || !file) {
      return NextResponse.json(
        { error: 'Survey name and file are required' },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()

    // Process file with DeepSeek LLM
    const surveyData = await processFileWithDeepSeek(fileContent)

    // Create survey in database
    const surveyId = await createSurveyInDatabase(surveyName, surveyData, user.id)

    // Use database user hashkey as fallback if JWT doesn't have it
    const userHashkey = decoded.hashkey || user.hashkey
    
    console.log('Survey created successfully:', { 
      surveyId, 
      userHashkey,
      fromJWT: !!decoded.hashkey,
      fromDB: !!user.hashkey
    })
    
    return NextResponse.json({
      success: true,
      userHashkey: userHashkey,
      surveyId: surveyId
    })

  } catch (error) {
    console.error('Error creating survey:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processFileWithDeepSeek(fileContent: string): Promise<ParsedSurvey> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured')
  }

  const prompt = `Analyze the text and create a survey. Return ONLY valid JSON with no markdown, explanations, or extra text.

Required JSON structure:
{
  "title": "Survey Title",
  "description": "Brief description",
  "questions": [
    {
      "question_text": "Question text",
      "options": [
        {"option_letter": "A", "option_text": "Option A"},
        {"option_letter": "B", "option_text": "Option B"},
        {"option_letter": "C", "option_text": "Option C"},
        {"option_letter": "D", "option_text": "Option D"}
      ]
    }
  ]
}

Text content to analyze:
${fileContent}

Return only the JSON object, no markdown formatting:`

  let content = ''
  
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data: DeepSeekResponse = await response.json()
    content = data.choices[0]?.message?.content || ''

    if (!content) {
      throw new Error('No content returned from DeepSeek API')
    }

    // Parse JSON response (handle markdown code blocks)
    let jsonContent = content.trim()
    
    // Remove markdown code block markers if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    const parsedSurvey = JSON.parse(jsonContent) as ParsedSurvey

    // Validate structure
    if (!parsedSurvey.title || !parsedSurvey.questions || !Array.isArray(parsedSurvey.questions)) {
      throw new Error('Invalid survey structure returned from LLM')
    }

    return parsedSurvey

  } catch (error) {
    console.error('DeepSeek API error:', error)
    console.error('Raw content received:', content ? content.substring(0, 500) + '...' : 'No content')
    
    // Fallback: create a basic survey structure
    return {
      title: 'Generated Survey',
      description: 'Survey generated from uploaded content due to processing error',
      questions: [
        {
          question_text: 'How would you rate the content of the uploaded file?',
          options: [
            { option_letter: 'A', option_text: 'Excellent' },
            { option_letter: 'B', option_text: 'Good' },
            { option_letter: 'C', option_text: 'Fair' },
            { option_letter: 'D', option_text: 'Poor' }
          ]
        },
        {
          question_text: 'What type of content was most interesting to you?',
          options: [
            { option_letter: 'A', option_text: 'Technical information' },
            { option_letter: 'B', option_text: 'General concepts' },
            { option_letter: 'C', option_text: 'Examples and cases' },
            { option_letter: 'D', option_text: 'Overall structure' }
          ]
        }
      ]
    }
  }
}

async function createSurveyInDatabase(
  surveyName: string,
  surveyData: ParsedSurvey,
  creatorId: number
): Promise<number> {
  const createSurveyData: CreateSurveyData = {
    title: surveyName,
    description: surveyData.description || 'Generated survey',
    creator_id: creatorId,
    questions: surveyData.questions.map(q => ({
      question_text: q.question_text,
      options: q.options
    }))
  }

  return await SurveyService.createSurvey(createSurveyData)
}