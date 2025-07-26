// Check if all users have hashkeys
// Run with: node scripts/check-user-hashkeys.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function checkUserHashkeys() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔍 Checking user hashkeys...\n');

    // Get all users
    const users = await pool.query(`
      SELECT id, username, email, hashkey, created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    console.log(`📊 Found ${users.rows.length} users:`);
    
    let usersWithoutHashkey = 0;
    
    users.rows.forEach(user => {
      const hasHashkey = !!user.hashkey;
      const hashkeyDisplay = user.hashkey || 'MISSING';
      const status = hasHashkey ? '✅' : '❌';
      
      console.log(`   ${status} User ${user.id}: ${user.username} (${user.email})`);
      console.log(`      Hashkey: ${hashkeyDisplay}`);
      console.log(`      Created: ${user.created_at}`);
      console.log('');
      
      if (!hasHashkey) {
        usersWithoutHashkey++;
      }
    });

    if (usersWithoutHashkey > 0) {
      console.log(`⚠️  ${usersWithoutHashkey} users are missing hashkeys!`);
      console.log('   This might cause redirect issues after survey creation.');
      console.log('   Users need to log out and log back in to get new JWT tokens with hashkeys.');
    } else {
      console.log('🎉 All users have hashkeys!');
    }

    // Check if hashkeys are unique
    const uniqueHashkeys = await pool.query(`
      SELECT COUNT(*) as total, COUNT(DISTINCT hashkey) as unique
      FROM users 
      WHERE hashkey IS NOT NULL
    `);

    const { total, unique } = uniqueHashkeys.rows[0];
    console.log(`\n🔢 Hashkey uniqueness check:`);
    console.log(`   Total users with hashkeys: ${total}`);
    console.log(`   Unique hashkeys: ${unique}`);
    console.log(`   All unique: ${total === unique ? '✅ YES' : '❌ NO'}`);

  } catch (error) {
    console.error('❌ Error checking user hashkeys:', error.message);
  } finally {
    await pool.end();
  }
}

checkUserHashkeys();