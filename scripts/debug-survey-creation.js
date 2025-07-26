// Debug survey creation flow
// Run with: node scripts/debug-survey-creation.js

require('dotenv').config({ path: '.env.local' });
const jwt = require('jsonwebtoken');

// Sample JWT payload that might be in the token
const sampleTokenPayload = {
  id: "google-123456789",
  email: "test@example.com", 
  name: "Test User",
  picture: "https://example.com/pic.jpg",
  verified_email: true,
  userId: 1
  // Note: hashkey might be missing in existing tokens
};

// Sample JWT payload with hashkey (new tokens)
const newTokenPayload = {
  ...sampleTokenPayload,
  hashkey: "c672b2c1"
};

console.log('🧪 Testing JWT token scenarios...\n');

console.log('1️⃣ Old token (without hashkey):');
const oldToken = jwt.sign(sampleTokenPayload, process.env.JWT_SECRET);
const decodedOld = jwt.verify(oldToken, process.env.JWT_SECRET);
console.log('   Decoded:', {
  userId: decodedOld.userId,
  email: decodedOld.email,
  hashkey: decodedOld.hashkey || 'MISSING'
});

console.log('\n2️⃣ New token (with hashkey):');
const newToken = jwt.sign(newTokenPayload, process.env.JWT_SECRET);
const decodedNew = jwt.verify(newToken, process.env.JWT_SECRET);
console.log('   Decoded:', {
  userId: decodedNew.userId,
  email: decodedNew.email,
  hashkey: decodedNew.hashkey || 'MISSING'
});

console.log('\n3️⃣ Fallback logic test:');
const userFromDB = {
  id: 1,
  hashkey: 'c672b2c1',
  email: 'test@example.com'
};

// Simulate the fallback logic in create-survey
const userHashkey = decodedOld.hashkey || userFromDB.hashkey;
console.log('   JWT hashkey:', decodedOld.hashkey || 'MISSING');
console.log('   DB hashkey:', userFromDB.hashkey);
console.log('   Final hashkey:', userHashkey);

console.log('\n✅ The fallback should work even with old tokens!');
console.log('   If it\'s still not working, the issue is elsewhere.');

console.log('\n🔍 Debugging tips:');
console.log('   1. Check server logs for "Survey created successfully" message');
console.log('   2. Check browser console for "Survey creation response"');
console.log('   3. Visit /api/debug-token to see current token contents');
console.log('   4. Make sure user exists in database with hashkey');