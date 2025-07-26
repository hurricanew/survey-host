// Simple database connection test script
// Run with: node scripts/test-db.js

const { Pool } = require('pg');

async function testDatabaseConnection() {
  // Load environment variables from .env.local
  require('dotenv').config({ path: '.env.local' });
  
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    return;
  }
  
  console.log('🔍 Using DATABASE_URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Render requires SSL
    connectionTimeoutMillis: 10000, // 10 second timeout
  });

  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query test successful. Current time:', result.rows[0].current_time);
    
    // Test if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Users table exists');
      
      // Count users
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`📊 Current user count: ${userCount.rows[0].count}`);
    } else {
      console.log('⚠️  Users table does not exist. Run the schema.sql file first.');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error details:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('💡 This usually means the hostname is incorrect or the database server is not running.');
    } else if (error.code === '28P01') {
      console.error('💡 This usually means the username or password is incorrect.');
    } else if (error.code === '3D000') {
      console.error('💡 This usually means the database name is incorrect.');
    }
  } finally {
    await pool.end();
  }
}

testDatabaseConnection();