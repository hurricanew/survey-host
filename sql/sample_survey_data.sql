-- Sample survey data based on doc/sample.txt
-- Financial behavior assessment survey in Chinese

-- Insert the financial behavior survey
INSERT INTO surveys (title, description, creator_id, is_active) 
VALUES (
    '财务行为评估调查',
    '这是一份关于个人财务管理行为的调查问卷，旨在了解您的理财习惯和行为模式。',
    1, -- Assuming user with ID 1 exists (adjust as needed)
    TRUE
) ON CONFLICT DO NOTHING;

-- Get the survey ID for reference (assuming it's the first survey)
-- Note: In a real application, you'd want to handle this more robustly

-- Insert questions for the financial behavior survey
-- Question 1
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    1,
    '是否常丢失现金/物品（如钱包、钥匙）？',
    'multiple_choice',
    TRUE
);

-- Question 1 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 1), 'A', '从不', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 1), 'B', '偶尔（1-2次/半年）', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 1), 'C', '较频繁（3-5次）', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 1), 'D', '总是（>5次）', 4);

-- Question 2
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    2,
    '是否因冲动购买闲置物品？',
    'multiple_choice',
    TRUE
);

-- Question 2 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 2), 'A', '极少', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 2), 'B', '有时（月均1件）', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 2), 'C', '经常（月均2-3件）', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 2), 'D', '大量（>3件）', 4);

-- Question 3
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    3,
    '是否忽视小额支出（如奶茶、打车）？',
    'multiple_choice',
    TRUE
);

-- Question 3 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 3), 'A', '严格记账', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 3), 'B', '偶尔忽略', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 3), 'C', '常忽略', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 3), 'D', '从不记账', 4);

-- Question 4
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    4,
    '是否因人情压力借出无法收回的钱？',
    'multiple_choice',
    TRUE
);

-- Question 4 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 4), 'A', '无外借', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 4), 'B', '借出≤10%收入', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 4), 'C', '借出10%-30%收入', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 4), 'D', '借出>30%收入', 4);

-- Question 5
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    5,
    '是否因拖延错过缴费/续费优惠？',
    'multiple_choice',
    TRUE
);

-- Question 5 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 5), 'A', '从未', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 5), 'B', '1-2次', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 5), 'C', '3-4次', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 5), 'D', '>5次', 4);

-- Question 6
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    6,
    '是否因怕麻烦放弃退款/维权？',
    'multiple_choice',
    TRUE
);

-- Question 6 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 6), 'A', '必维权', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 6), 'B', '金额大才维权', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 6), 'C', '除非极大损失', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 6), 'D', '从不维权', 4);

-- Question 7
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    7,
    '是否常为情绪买单（如生气/悲伤时购物）？',
    'multiple_choice',
    TRUE
);

-- Question 7 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 7), 'A', '从不', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 7), 'B', '较少（1-2次/季）', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 7), 'C', '较多（月均1次）', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 7), 'D', '经常（周均1次）', 4);

-- Question 8
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    8,
    '是否忽视理财规划（如储蓄、保险）？',
    'multiple_choice',
    TRUE
);

-- Question 8 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 8), 'A', '有明确计划', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 8), 'B', '粗略计划', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 8), 'C', '偶尔考虑', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 8), 'D', '完全不想', 4);

-- Question 9
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    9,
    '是否因"面子"承担超额消费（如请客、奢侈品）？',
    'multiple_choice',
    TRUE
);

-- Question 9 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 9), 'A', '量力而行', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 9), 'B', '偶尔', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 9), 'C', '经常', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 9), 'D', '总是', 4);

-- Question 10
INSERT INTO questions (survey_id, question_number, question_text, question_type, is_required)
VALUES (
    (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1),
    10,
    '是否对收入来源单一化感到不安却无行动？',
    'multiple_choice',
    TRUE
);

-- Question 10 Answer Options
INSERT INTO answer_options (question_id, option_letter, option_text, option_value)
VALUES 
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 10), 'A', '有3条+收入渠道', 1),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 10), 'B', '有2条渠道', 2),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 10), 'C', '仅有主业', 3),
    ((SELECT id FROM questions WHERE survey_id = (SELECT id FROM surveys WHERE title = '财务行为评估调查' LIMIT 1) AND question_number = 10), 'D', '无稳定收入', 4);

-- Display survey information
SELECT 
    s.id as survey_id,
    s.hashkey,
    s.title,
    COUNT(q.id) as total_questions
FROM surveys s
LEFT JOIN questions q ON s.id = q.survey_id
WHERE s.title = '财务行为评估调查'
GROUP BY s.id, s.hashkey, s.title;