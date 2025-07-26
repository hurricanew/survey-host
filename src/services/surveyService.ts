import { query } from '@/lib/db'

export interface Survey {
  id: number
  hashkey: string
  title: string
  description: string
  creator_id: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Question {
  id: number
  survey_id: number
  question_number: number
  question_text: string
  question_type: string
  is_required: boolean
  created_at: Date
  updated_at: Date
}

export interface AnswerOption {
  id: number
  question_id: number
  option_letter: string
  option_text: string
  option_value: number
  created_at: Date
}

export interface CreateSurveyData {
  title: string
  description?: string
  creator_id: number
  questions: CreateQuestionData[]
}

export interface CreateQuestionData {
  question_text: string
  options: CreateOptionData[]
}

export interface CreateOptionData {
  option_letter: string
  option_text: string
}

export interface SurveyWithQuestions extends Survey {
  questions: QuestionWithOptions[]
}

export interface QuestionWithOptions extends Question {
  options: AnswerOption[]
}

export class SurveyService {
  static async createSurvey(surveyData: CreateSurveyData): Promise<number> {
    try {
      // Start transaction
      await query('BEGIN')

      // Create survey
      const surveyResult = await query(`
        INSERT INTO surveys (title, description, creator_id, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, TRUE, NOW(), NOW())
        RETURNING id
      `, [surveyData.title, surveyData.description || '', surveyData.creator_id])

      const surveyId = surveyResult.rows[0].id

      // Create questions and options
      for (let i = 0; i < surveyData.questions.length; i++) {
        const questionData = surveyData.questions[i]
        
        // Insert question
        const questionResult = await query(`
          INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required, created_at, updated_at)
          VALUES ($1, $2, $3, 'multiple_choice', TRUE, NOW(), NOW())
          RETURNING id
        `, [surveyId, i + 1, questionData.question_text])

        const questionId = questionResult.rows[0].id

        // Insert answer options
        for (let j = 0; j < questionData.options.length; j++) {
          const optionData = questionData.options[j]
          await query(`
            INSERT INTO answer_options (question_id, option_letter, option_text, option_value, created_at)
            VALUES ($1, $2, $3, $4, NOW())
          `, [questionId, optionData.option_letter, optionData.option_text, j + 1])
        }
      }

      // Commit transaction
      await query('COMMIT')

      return surveyId

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK')
      throw error
    }
  }

  static async getSurveyByHashkey(hashkey: string): Promise<SurveyWithQuestions | null> {
    const surveyResult = await query(`
      SELECT 
        s.id as survey_id,
        s.hashkey,
        s.title,
        s.description,
        s.creator_id,
        s.is_active,
        s.created_at as survey_created_at,
        s.updated_at as survey_updated_at,
        q.id as question_id,
        q.question_number,
        q.question_text,
        q.question_type,
        q.is_required,
        q.created_at as question_created_at,
        q.updated_at as question_updated_at,
        ao.id as option_id,
        ao.option_letter,
        ao.option_text,
        ao.option_value,
        ao.created_at as option_created_at
      FROM surveys s
      LEFT JOIN questions q ON s.id = q.survey_id
      LEFT JOIN answer_options ao ON q.id = ao.question_id
      WHERE s.hashkey = $1 AND s.is_active = TRUE
      ORDER BY q.question_number, ao.option_letter
    `, [hashkey])

    if (surveyResult.rows.length === 0) {
      return null
    }

    // Group data into structured format
    const surveyData = surveyResult.rows[0]
    const survey: SurveyWithQuestions = {
      id: surveyData.survey_id,
      hashkey: surveyData.hashkey,
      title: surveyData.title,
      description: surveyData.description,
      creator_id: surveyData.creator_id,
      is_active: surveyData.is_active,
      created_at: surveyData.survey_created_at,
      updated_at: surveyData.survey_updated_at,
      questions: []
    }

    // Group questions and options
    const questionsMap = new Map<number, QuestionWithOptions>()
    
    surveyResult.rows.forEach(row => {
      if (!row.question_id) return // Skip if no questions yet
      
      if (!questionsMap.has(row.question_id)) {
        questionsMap.set(row.question_id, {
          id: row.question_id,
          survey_id: row.survey_id,
          question_number: row.question_number,
          question_text: row.question_text,
          question_type: row.question_type,
          is_required: row.is_required,
          created_at: row.question_created_at,
          updated_at: row.question_updated_at,
          options: []
        })
      }
      
      if (row.option_id) {
        questionsMap.get(row.question_id)!.options.push({
          id: row.option_id,
          question_id: row.question_id,
          option_letter: row.option_letter,
          option_text: row.option_text,
          option_value: row.option_value,
          created_at: row.option_created_at
        })
      }
    })

    survey.questions = Array.from(questionsMap.values())
      .sort((a, b) => a.question_number - b.question_number)

    return survey
  }

  static async getSurveysByCreator(creatorId: number): Promise<Survey[]> {
    const result = await query(`
      SELECT * FROM surveys 
      WHERE creator_id = $1 AND is_active = TRUE
      ORDER BY created_at DESC
    `, [creatorId])

    return result.rows
  }

  static async deleteSurvey(id: number, creatorId: number): Promise<boolean> {
    const result = await query(`
      UPDATE surveys 
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = $1 AND creator_id = $2
    `, [id, creatorId])

    return (result.rowCount ?? 0) > 0
  }

  static async updateSurvey(
    id: number, 
    creatorId: number, 
    updateData: { title?: string; description?: string }
  ): Promise<Survey | null> {
    const updates: string[] = []
    const values: (string | number)[] = []
    let paramCount = 1

    if (updateData.title !== undefined) {
      updates.push(`title = $${paramCount}`)
      values.push(updateData.title)
      paramCount++
    }

    if (updateData.description !== undefined) {
      updates.push(`description = $${paramCount}`)
      values.push(updateData.description)
      paramCount++
    }

    if (updates.length === 0) {
      return this.getSurveyById(id)
    }

    updates.push(`updated_at = NOW()`)
    values.push(id, creatorId)

    const updateQuery = `
      UPDATE surveys 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount} AND creator_id = $${paramCount + 1} AND is_active = TRUE
      RETURNING *
    `

    const result = await query(updateQuery, values)
    return result.rows[0] || null
  }

  private static async getSurveyById(id: number): Promise<Survey | null> {
    const result = await query('SELECT * FROM surveys WHERE id = $1', [id])
    return result.rows[0] || null
  }
}