-- Migration script to add hashkey column to existing users table
-- Run this script if you already have a users table without the hashkey column

-- Enable the pgcrypto extension for random bytes generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add the hashkey column with unique constraint (without default for now)
ALTER TABLE users ADD COLUMN IF NOT EXISTS hashkey VARCHAR(8) UNIQUE;

-- Update existing users to have unique hashkeys if they don't already have one
UPDATE users SET hashkey = encode(gen_random_bytes(4), 'hex') WHERE hashkey IS NULL;

-- Make the column NOT NULL after setting values
ALTER TABLE users ALTER COLUMN hashkey SET NOT NULL;

-- Set default value for future inserts
ALTER TABLE users ALTER COLUMN hashkey SET DEFAULT encode(gen_random_bytes(4), 'hex');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_hashkey ON users(hashkey);

-- Verify the migration
SELECT COUNT(*) as total_users, COUNT(DISTINCT hashkey) as unique_hashkeys FROM users;