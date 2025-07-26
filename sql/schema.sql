-- Enable the pgcrypto extension for random bytes generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table for storing user information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    hashkey VARCHAR(8) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex'),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    picture TEXT,
    verified_email BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_hashkey ON users(hashkey);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Sample data insertion (as provided in requirement)
-- INSERT INTO users (username, email) VALUES ('jane_smith1', 'jane1@example.com');