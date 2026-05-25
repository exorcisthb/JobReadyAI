-- SQL script to manually update the admin account to email format
-- Run this query in your PostgreSQL database tool (e.g. pgAdmin, DBeaver) to update the existing admin user:

UPDATE users 
SET email = 'admin@jobreadyai.com', 
    phone = NULL, 
    auth_provider = 'email', 
    otp_verified = true,
    status = 'active'
WHERE role = 'admin';
