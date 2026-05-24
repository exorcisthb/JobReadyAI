import "./env.js";

import pg from "pg";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "DATABASE_URL is not set. Auth API requests will fail until PostgreSQL is configured.",
  );
}

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    })
  : null;

function assertPool() {
  if (!pool) {
    throw new ApiError(503, "Database is not configured.");
  }
}

export async function query(sql, params = []) {
  assertPool();
  return pool.query(sql, params);
}

export async function withTransaction(callback) {
  assertPool();

  const client = await pool.connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureSchema() {
  if (!pool) return;

  await query("create extension if not exists pgcrypto;");

  // Tạo bảng users nếu chưa tồn tại
  await query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email varchar(255),
      phone varchar(20),
      google_id varchar(255),
      password_hash varchar(255),
      otp varchar(6),
      otp_expiry timestamp,
      otp_verified boolean default false,
      auth_provider varchar(50) default 'email',
      status varchar(50) default 'active',
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  await query("alter table users add column if not exists email varchar(255)");
  await query("alter table users add column if not exists phone varchar(20)");
  await query("alter table users add column if not exists google_id varchar(255)");
  await query("alter table users add column if not exists password_hash varchar(255)");
  await query("alter table users add column if not exists otp varchar(6)");
  await query("alter table users add column if not exists otp_expiry timestamp");
  await query("alter table users add column if not exists otp_verified boolean default false");
  await query("alter table users add column if not exists auth_provider varchar(50) default 'email'");
  await query("alter table users alter column email drop not null");

  await query("alter table users add column if not exists role varchar(50) default 'user'");

  // Tạo bảng user_profiles nếu chưa tồn tại
  await query(`
    create table if not exists user_profiles (
      id uuid primary key default gen_random_uuid(),
      user_id uuid unique not null references users(id) on delete cascade,
      full_name varchar(255),
      avatar_url text,
      phone varchar(20),
      job_title varchar(255),
      industry varchar(255),
      experience_level varchar(50),
      location varchar(255),
      skills text,
      career_goal text,
      profile_completed boolean default false,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Bảng lưu OTP tạm thời - chưa tạo tài khoản chính thức
  await query(`
    create table if not exists otp_requests (
      email varchar(255) primary key,
      otp varchar(6) not null,
      otp_expiry timestamp not null,
      verified boolean default false,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Tạo indexes
  // Xóa unique constraint và unique index cũ trên email đơn lẻ (không còn phù hợp vì cho phép cùng email với provider khác nhau)
  await query("alter table users drop constraint if exists users_email_key");
  await query("drop index if exists idx_users_email");
  await query("drop index if exists idx_users_email_unique");
  // Unique composite: cùng email + cùng provider thì mới coi là trùng
  await query(
    "create unique index if not exists idx_users_email_provider on users(email, auth_provider) where email is not null"
  );
  await query("create unique index if not exists idx_users_google_id on users(google_id) where google_id is not null");
  await query("create unique index if not exists idx_users_phone on users(phone) where phone is not null");
  await query("create index if not exists idx_users_otp_verified on users(otp_verified)");
  await query("create index if not exists idx_user_profiles_user_id on user_profiles(user_id)");

  // Seed default admin account if configured in env
  const adminPhone = process.env.ADMIN_PHONE;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPhone && adminPassword) {
    const adminCheck = await query("select id, password_hash from users where phone = $1", [adminPhone]);
    
    if (adminCheck.rows.length === 0) {
      console.log(`Seeding default admin account with phone: ${adminPhone}`);
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await withTransaction(async (client) => {
        const userResult = await client.query(
          `
            insert into users (phone, password_hash, otp_verified, status, role)
            values ($1, $2, true, 'active', 'admin')
            returning id
          `,
          [adminPhone, hashedPassword]
        );
        const adminUser = userResult.rows[0];
        
        await client.query(
          `
            insert into user_profiles (user_id, full_name, profile_completed)
            values ($1, 'System Administrator', true)
          `,
          [adminUser.id]
        );
      });
      console.log("Admin account seeded successfully.");
    } else {
      // Admin exists, check if password in .env changed and update it in DB
      const adminUser = adminCheck.rows[0];
      const isPasswordSame = await bcrypt.compare(adminPassword, adminUser.password_hash);
      
      if (!isPasswordSame) {
        console.log(`Updating password for admin account with phone: ${adminPhone}...`);
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await query("update users set password_hash = $1 where id = $2", [hashedPassword, adminUser.id]);
        console.log("Admin password updated successfully in database.");
      }
    }
  }
}
