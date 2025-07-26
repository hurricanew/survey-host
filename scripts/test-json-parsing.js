// Test JSON parsing with markdown code blocks
// Run with: node scripts/test-json-parsing.js

// Simulate the problematic response from DeepSeek
const problematicResponse = `\`\`\`json
{
  "title": "Customer Experience Survey",
  "description": "Survey about customer satisfaction and feedback",
  "questions": [
    {
      "question_text": "How would you rate our customer service?",
      "options": [
        {"option_letter": "A", "option_text": "Excellent"},
        {"option_letter": "B", "option_text": "Good"},
        {"option_letter": "C", "option_text": "Average"},
        {"option_letter": "D", "option_text": "Poor"}
      ]
    }
  ]
}
\`\`\``;

function cleanJsonContent(content) {
  let jsonContent = content.trim()
  
  // Remove markdown code block markers if present
  if (jsonContent.startsWith('```json')) {
    jsonContent = jsonContent.replace(/^```json\s*/i, '').replace(/\s*```$/, '')
  } else if (jsonContent.startsWith('```')) {
    jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }
  
  return jsonContent
}

console.log('🧪 Testing JSON parsing with markdown code blocks...\n');

console.log('1️⃣ Original problematic response:');
console.log(problematicResponse);

console.log('\n2️⃣ After cleaning:');
const cleaned = cleanJsonContent(problematicResponse);
console.log(cleaned);

console.log('\n3️⃣ Parsing test:');
try {
  const parsed = JSON.parse(cleaned);
  console.log('✅ Successfully parsed JSON:');
  console.log('   Title:', parsed.title);
  console.log('   Questions:', parsed.questions.length);
  console.log('   First question:', parsed.questions[0].question_text);
  console.log('   Options:', parsed.questions[0].options.length);
} catch (error) {
  console.log('❌ Failed to parse JSON:', error.message);
}

// Test with regular JSON (no markdown)
console.log('\n4️⃣ Testing with regular JSON:');
const regularJson = '{"title": "Test Survey", "questions": []}';
try {
  const cleanedRegular = cleanJsonContent(regularJson);
  const parsedRegular = JSON.parse(cleanedRegular);
  console.log('✅ Regular JSON also works:', parsedRegular.title);
} catch (error) {
  console.log('❌ Regular JSON failed:', error.message);
}

console.log('\n🎉 JSON parsing fix should work correctly!');