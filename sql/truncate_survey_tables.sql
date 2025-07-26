-- Alternative approach using TRUNCATE (faster and automatically resets sequences)
-- This will completely empty the tables and reset auto-increment sequences

TRUNCATE TABLE answer_options, questions, surveys RESTART IDENTITY CASCADE;

-- Verify tables are empty
SELECT 'After TRUNCATE - Verification' as status;
SELECT 'surveys' as table_name, COUNT(*) as row_count FROM surveys
UNION ALL
SELECT 'questions' as table_name, COUNT(*) as row_count FROM questions  
UNION ALL
SELECT 'answer_options' as table_name, COUNT(*) as row_count FROM answer_options
ORDER BY table_name;