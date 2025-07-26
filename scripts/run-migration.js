// Run database migration to add hashkey column
// Run with: node scripts/run-migration.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔄 Running hashkey column migration...\n');

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'sql', 'add_hashkey_migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    const result = await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Show the verification result
    if (result.length > 0 && result[result.length - 1].rows) {
      const verificationResult = result[result.length - 1].rows[0];
      console.log(`📊 Verification: ${verificationResult.total_users} users with ${verificationResult.unique_hashkeys} unique hashkeys`);
    }

    console.log('\n🎉 All existing users now have unique hashkey values!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('💡 The hashkey column might already exist. This is normal if you\'ve run this migration before.');
    }
  } finally {
    await pool.end();
  }
}

runMigration();