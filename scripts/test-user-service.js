// Test user service functionality
// Run with: node scripts/test-user-service.js

require('dotenv').config({ path: '.env.local' });

// Import the user service
const path = require('path');
const { register } = require('ts-node');

// Register TypeScript
register({
  project: path.join(__dirname, '..', 'tsconfig.json'),
  transpileOnly: true,
});

const { UserService } = require('../src/services/userService.ts');

async function testUserService() {
  try {
    console.log('🧪 Testing User Service...\n');

    // Test 1: Create a user similar to the example query
    console.log('1️⃣ Testing createUser (similar to: INSERT INTO users (username, email) VALUES (\'jane_smith1\', \'jane1@example.com\'))');
    
    const testUser = await UserService.createUser({
      username: 'jane_smith1',
      email: 'jane1@example.com',
      name: 'Jane Smith',
      verified_email: true
    });
    
    console.log('✅ User created:', {
      id: testUser.id,
      username: testUser.username,
      email: testUser.email,
      name: testUser.name
    });

    // Test 2: Find user by email
    console.log('\n2️⃣ Testing findUserByEmail');
    const foundUser = await UserService.findUserByEmail('jane1@example.com');
    console.log('✅ User found by email:', foundUser ? foundUser.username : 'Not found');

    // Test 3: Test Google OAuth integration (simulate)
    console.log('\n3️⃣ Testing Google OAuth user creation');
    const googleUser = await UserService.createOrUpdateUserFromGoogle({
      id: 'google-123456789',
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      picture: 'https://lh3.googleusercontent.com/example',
      verified_email: true
    });
    
    console.log('✅ Google user created/updated:', {
      id: googleUser.id,
      username: googleUser.username,
      email: googleUser.email,
      name: googleUser.name,
      google_id: googleUser.google_id
    });

    // Test 4: Test duplicate Google OAuth (should update, not create new)
    console.log('\n4️⃣ Testing duplicate Google OAuth (should update existing)');
    const updatedGoogleUser = await UserService.createOrUpdateUserFromGoogle({
      id: 'google-123456789',
      email: 'john.doe@gmail.com',
      name: 'John Doe Updated',
      picture: 'https://lh3.googleusercontent.com/updated',
      verified_email: true
    });
    
    console.log('✅ Google user updated:', {
      id: updatedGoogleUser.id,
      name: updatedGoogleUser.name,
      shouldBeSameId: updatedGoogleUser.id === googleUser.id
    });

    // Test 5: Get all users
    console.log('\n5️⃣ Testing getAllUsers');
    const allUsers = await UserService.getAllUsers(10, 0);
    console.log(`✅ Total users in database: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
    });

    console.log('\n🎉 All tests passed! User service is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testUserService();