-- Survey System Database Schema
-- This file creates tables for surveys, questions, answer options, and user responses

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Surveys table - stores survey metadata
CREATE TABLE IF NOT EXISTS surveys (
    id SERIAL PRIMARY KEY,
    hashkey VARCHAR(8) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex'),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table - stores survey questions
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice', -- future extensibility
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(survey_id, question_number)
);

-- Answer options table - stores possible answers for each question
CREATE TABLE IF NOT EXISTS answer_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_letter VARCHAR(5) NOT NULL, -- A, B, C, D, etc.
    option_text TEXT NOT NULL,
    option_value INTEGER, -- for scoring/analysis purposes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_id, option_letter)
);


-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_surveys_hashkey ON surveys(hashkey);
CREATE INDEX IF NOT EXISTS idx_surveys_creator_id ON surveys(creator_id);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_questions_number ON questions(survey_id, question_number);
CREATE INDEX IF NOT EXISTS idx_answer_options_question_id ON answer_options(question_id);

-- Add helpful comments
COMMENT ON TABLE surveys IS 'Stores survey metadata and configuration';
COMMENT ON TABLE questions IS 'Stores individual questions for each survey';
COMMENT ON TABLE answer_options IS 'Stores possible answer choices for each question';

COMMENT ON COLUMN surveys.hashkey IS 'Unique 8-character hex identifier for public URLs';
COMMENT ON COLUMN answer_options.option_value IS 'Numerical value for scoring/analysis (optional)';