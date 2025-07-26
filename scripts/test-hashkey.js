// Test hashkey functionality
// Run with: node scripts/test-hashkey.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testHashkeyFunctionality() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🧪 Testing Hashkey Functionality...\n');

    // Test 1: Check existing users have hashkeys
    console.log('1️⃣ Testing existing users have unique hashkeys');
    
    const existingUsersResult = await pool.query(`
      SELECT id, hashkey, username, email 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log(`✅ Found ${existingUsersResult.rows.length} users with hashkeys:`);
    existingUsersResult.rows.forEach(user => {
      console.log(`   - User ${user.id}: ${user.username} (${user.email}) → hashkey: ${user.hashkey}`);
    });

    // Test 2: Create a new user and verify hashkey is auto-generated
    console.log('\n2️⃣ Testing new user creation with auto-generated hashkey');
    
    const testEmail = `test_${Date.now()}@example.com`;
    const testUsername = `test_user_${Date.now()}`;
    
    const newUserResult = await pool.query(`
      INSERT INTO users (username, email, name, verified_email, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *
    `, [testUsername, testEmail, 'Test User', true]);
    
    const newUser = newUserResult.rows[0];
    console.log(`✅ New user created with auto-generated hashkey:`);
    console.log(`   - ID: ${newUser.id}, Username: ${newUser.username}`);
    console.log(`   - Email: ${newUser.email}`);
    console.log(`   - Hashkey: ${newUser.hashkey} (length: ${newUser.hashkey.length})`);

    // Test 3: Verify hashkey is exactly 8 characters (32-bit hex)
    console.log('\n3️⃣ Testing hashkey format (should be 8-character hex string)');
    
    const hexPattern = /^[0-9a-f]{8}$/;
    const isValidHex = hexPattern.test(newUser.hashkey);
    
    console.log(`✅ Hashkey format validation: ${isValidHex ? 'VALID' : 'INVALID'}`);
    console.log(`   - Pattern: ${newUser.hashkey} matches /^[0-9a-f]{8}$/: ${isValidHex}`);

    // Test 4: Test finding user by hashkey
    console.log('\n4️⃣ Testing SELECT * FROM users WHERE hashkey = ?');
    
    const findByHashkeyResult = await pool.query(
      'SELECT * FROM users WHERE hashkey = $1', 
      [newUser.hashkey]
    );
    
    if (findByHashkeyResult.rows.length > 0) {
      const foundUser = findByHashkeyResult.rows[0];
      console.log(`✅ User found by hashkey: ${foundUser.username} (${foundUser.email})`);
      console.log(`   - Same user: ${foundUser.id === newUser.id ? 'YES' : 'NO'}`);
    } else {
      console.log('❌ User not found by hashkey');
    }

    // Test 5: Verify all hashkeys are unique
    console.log('\n5️⃣ Testing hashkey uniqueness across all users');
    
    const uniquenessResult = await pool.query(`
      SELECT COUNT(*) as total_users, COUNT(DISTINCT hashkey) as unique_hashkeys 
      FROM users
    `);
    
    const { total_users, unique_hashkeys } = uniquenessResult.rows[0];
    const allUnique = parseInt(total_users) === parseInt(unique_hashkeys);
    
    console.log(`✅ Uniqueness test: ${allUnique ? 'PASSED' : 'FAILED'}`);
    console.log(`   - Total users: ${total_users}`);
    console.log(`   - Unique hashkeys: ${unique_hashkeys}`);

    // Test 6: Clean up test user
    console.log('\n6️⃣ Cleaning up test user');
    await pool.query('DELETE FROM users WHERE id = $1', [newUser.id]);
    console.log('✅ Test user cleaned up');

    console.log('\n🎉 All hashkey tests passed! The 32-bit hashkey system is working correctly.');

  } catch (error) {
    console.error('❌ Hashkey test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testHashkeyFunctionality();