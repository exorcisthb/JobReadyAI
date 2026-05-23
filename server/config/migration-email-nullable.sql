-- Cho phép tài khoản phone/password không cần email.
-- Email vẫn được giữ lại cho Google/OAuth và unique khi có giá trị.

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
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
