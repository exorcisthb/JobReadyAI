-- SQL Script to update users table schema to support Email and Google SSO dual accounts

-- 1. Add the auth_provider column if it does not exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider varchar(50) DEFAULT 'email';

-- 2. Drop the single unique constraint and index on email
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_email_unique;

-- 3. Create unique index for (email, auth_provider) composite key
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_provider ON users(email, auth_provider) WHERE email IS NOT NULL;
