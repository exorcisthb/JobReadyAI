-- SQL Migration: Phone-based authentication with OTP.
-- Email is nullable because phone/password accounts do not use email.
-- Google/OAuth accounts can still store email and keep it unique when present.

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
  ADD COLUMN IF NOT EXISTS otp VARCHAR(6),
  ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP,
  ADD COLUMN IF NOT EXISTS otp_verified BOOLEAN DEFAULT FALSE;

ALTER TABLE IF EXISTS users
  ALTER COLUMN email DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
  ON users(email)
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
  ON users(email);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone
  ON users(phone)
  WHERE phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_otp_verified ON users(otp_verified);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

ALTER TABLE IF EXISTS user_profiles
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
