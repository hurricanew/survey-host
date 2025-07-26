# Database Setup Instructions

This project uses PostgreSQL as the database. Follow these steps to set up the database connection.

## Prerequisites

1. **PostgreSQL Database**: You need access to a PostgreSQL database. This can be:
   - A local PostgreSQL installation
   - A cloud service like Supabase, Neon, or Railway
   - A managed PostgreSQL service from AWS RDS, Google Cloud SQL, etc.

## Setup Steps

### 1. Configure Environment Variables

Update the `DATABASE_URL` in your `.env.local` file with your actual PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

**Connection String Format:**
- `username`: Your PostgreSQL username
- `password`: Your PostgreSQL password  
- `hostname`: Your PostgreSQL server hostname
- `5432`: Default PostgreSQL port (change if different)
- `database_name`: Your database name

**Example connection strings:**

For local PostgreSQL:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/survey_host
```

For Supabase:
```env
DATABASE_URL=postgresql://postgres:your-password@db.project-ref.supabase.co:5432/postgres
```

For Railway:
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

### 2. Create Database Schema

Run the SQL schema to create the required tables:

```sql
-- Connect to your PostgreSQL database and run:
\i sql/schema.sql
```

Or copy and paste the contents of `sql/schema.sql` into your database client.

### 3. Test Database Connection

Test your database connection:

```bash
# Make sure your DATABASE_URL is set in .env.local
node scripts/test-db.js
```

## Database Schema

### Users Table

The `users` table stores user information from Google OAuth:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    picture TEXT,
    verified_email BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Service Features

The `UserService` class provides the following functionality:

- **Create User**: Insert new users into the database
- **Find User**: Find users by email, Google ID, or database ID
- **Update User**: Update user information
- **Google OAuth Integration**: Automatically create or update users during Google sign-in
- **Username Generation**: Automatically generate usernames from name or email

## Google OAuth Integration

When a user signs in with Google, the system:

1. Receives user info from Google OAuth
2. Checks if user exists by Google ID
3. If not found, checks if user exists by email
4. Creates new user or updates existing user with Google data
5. Stores user in database with generated username
6. Issues JWT token with database user information

## Sample Usage

The user service follows the pattern mentioned in requirements:

```javascript
// This happens automatically during Google OAuth
await UserService.createOrUpdateUserFromGoogle({
  id: 'google-user-id',
  email: 'jane1@example.com',
  name: 'Jane Smith',
  picture: 'https://...',
  verified_email: true
});

// This generates a query similar to:
// INSERT INTO users (username, email, google_id, name, picture, verified_email, created_at, updated_at)
// VALUES ('jane_smith1', 'jane1@example.com', 'google-user-id', 'Jane Smith', 'https://...', true, NOW(), NOW())
```

## Troubleshooting

1. **Connection Refused**: Check if PostgreSQL server is running
2. **Authentication Failed**: Verify username/password in connection string
3. **Database Does Not Exist**: Create the database first
4. **SSL Errors**: For production, ensure SSL is properly configured
5. **Table Not Found**: Run the schema.sql file to create tables

## Environment Variables Reference

```env
# Required for database
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Required for Google OAuth (already configured)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
NEXTAUTH_URL=http://localhost:3000
```