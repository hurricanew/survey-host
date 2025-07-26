import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('render.com') 
        ? { rejectUnauthorized: false } 
        : process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,
    })
  }
  return pool
}

export async function query(text: string, params?: (string | number | boolean | null | undefined)[]) {
  const pool = getPool()
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

const db = { query, getPool }
export default db