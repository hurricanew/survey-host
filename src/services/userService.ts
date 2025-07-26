import { query } from '@/lib/db'

export interface User {
  id: number
  hashkey: string
  username: string
  email: string
  google_id?: string
  name?: string
  picture?: string
  verified_email?: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  username: string
  email: string
  google_id?: string
  name?: string
  picture?: string
  verified_email?: boolean
}

export interface UpdateUserData {
  username?: string
  email?: string
  google_id?: string
  name?: string
  picture?: string
  verified_email?: boolean
}

export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const { username, email, google_id, name, picture, verified_email } = userData
    
    const insertQuery = `
      INSERT INTO users (username, email, google_id, name, picture, verified_email, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `
    
    const values = [username, email, google_id, name, picture, verified_email]
    const result = await query(insertQuery, values)
    
    return result.rows[0]
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const selectQuery = 'SELECT * FROM users WHERE email = $1'
    const result = await query(selectQuery, [email])
    
    return result.rows[0] || null
  }

  static async findUserByGoogleId(googleId: string): Promise<User | null> {
    const selectQuery = 'SELECT * FROM users WHERE google_id = $1'
    const result = await query(selectQuery, [googleId])
    
    return result.rows[0] || null
  }

  static async findUserById(id: number): Promise<User | null> {
    const selectQuery = 'SELECT * FROM users WHERE id = $1'
    const result = await query(selectQuery, [id])
    
    return result.rows[0] || null
  }

  static async findUserByHashkey(hashkey: string): Promise<User | null> {
    const selectQuery = 'SELECT * FROM users WHERE hashkey = $1'
    const result = await query(selectQuery, [hashkey])
    
    return result.rows[0] || null
  }

  static async updateUser(id: number, userData: UpdateUserData): Promise<User | null> {
    const updates: string[] = []
    const values: (string | number | boolean | null | undefined)[] = []
    let paramCount = 1

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (updates.length === 0) {
      return this.findUserById(id)
    }

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await query(updateQuery, values)
    return result.rows[0] || null
  }

  static async createOrUpdateUserFromGoogle(googleUserData: {
    id: string
    email: string
    name: string
    picture: string
    verified_email: boolean
  }): Promise<User> {
    // First, try to find existing user by Google ID
    let existingUser = await this.findUserByGoogleId(googleUserData.id)
    
    if (existingUser) {
      // Update existing user with latest Google data
      return await this.updateUser(existingUser.id, {
        name: googleUserData.name,
        picture: googleUserData.picture,
        verified_email: googleUserData.verified_email,
      }) as User
    }

    // Check if user exists by email (in case they signed up differently before)
    existingUser = await this.findUserByEmail(googleUserData.email)
    
    if (existingUser) {
      // Link Google account to existing user
      return await this.updateUser(existingUser.id, {
        google_id: googleUserData.id,
        name: googleUserData.name,
        picture: googleUserData.picture,
        verified_email: googleUserData.verified_email,
      }) as User
    }

    // Create new user
    const username = this.generateUsername(googleUserData.email, googleUserData.name)
    
    return await this.createUser({
      username,
      email: googleUserData.email,
      google_id: googleUserData.id,
      name: googleUserData.name,
      picture: googleUserData.picture,
      verified_email: googleUserData.verified_email,
    })
  }

  private static generateUsername(email: string, name?: string): string {
    // Try to create username from name first
    if (name) {
      const nameUsername = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      if (nameUsername.length >= 3) {
        return nameUsername
      }
    }

    // Fall back to email-based username
    const emailUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_')
    return emailUsername || 'user'
  }

  static async deleteUser(id: number): Promise<boolean> {
    const deleteQuery = 'DELETE FROM users WHERE id = $1'
    const result = await query(deleteQuery, [id])
    
    return (result.rowCount ?? 0) > 0
  }

  static async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    const selectQuery = `
      SELECT * FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `
    const result = await query(selectQuery, [limit, offset])
    
    return result.rows
  }
}