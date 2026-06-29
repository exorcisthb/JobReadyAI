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

  // Táº¡o báº£ng users náº¿u chÆ°a tá»“n táº¡i
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
  await query("alter table users add column if not exists registration_ip inet");
  await query("alter table users add column if not exists last_login_ip inet");
  await query("alter table users add column if not exists last_login_at timestamp");
  await query("alter table users add column if not exists last_activity_at timestamptz");
  await query("create index if not exists idx_users_last_activity_at on users(last_activity_at desc)");
  await query("alter table users add column if not exists is_test_user boolean default false");

  await query(`
    create table if not exists deleted_test_users (
      email varchar(255) primary key,
      deleted_by uuid references users(id) on delete set null,
      deleted_at timestamp default now()
    )
  `);
  await query("alter table users alter column email drop not null");

  await query("alter table users add column if not exists role varchar(50) default 'user'");

  // Táº¡o báº£ng user_profiles náº¿u chÆ°a tá»“n táº¡i
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

  // Báº£ng lÆ°u OTP táº¡m thá»i - chÆ°a táº¡o tÃ i khoáº£n chÃ­nh thá»©c
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

  // Táº¡o báº£ng cvs lÆ°u trá»¯ CV cá»§a ngÆ°á»i dÃ¹ng
  await query(`
    create table if not exists cvs (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      title varchar(255) not null,
      file_name varchar(255),
      file_size integer,
      file_url text,
      uploaded_at timestamp default now(),
      type varchar(50) default 'uploaded'
    )
  `);

  // Báº£ng blog_posts cho cÃ¡c bÃ i viáº¿t career
  await query(`
    create table if not exists blog_posts (
      id uuid primary key default gen_random_uuid(),
      title varchar(500) not null,
      content text not null,
      excerpt text,
      category varchar(100) not null,
      author varchar(255) not null default 'JobReady AI',
      image_url text,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Äáº£m báº£o cÃ¡c cá»™t cáº§n thiáº¿t cho articles vÃ  blog_posts
  try {
    await query("alter table articles add column if not exists source_url text");
    await query("alter table blog_posts add column if not exists source_url text");
  } catch (err) {
    console.error("Lá»—i khi thÃªm cá»™t source_url:", err);
  }

  // Äáº£m báº£o cÃ¡c cá»™t cáº§n thiáº¿t tá»“n táº¡i trong báº£ng cvs náº¿u báº£ng Ä‘Ã£ Ä‘Æ°á»£c táº¡o tá»« trÆ°á»›c
  await query("alter table cvs add column if not exists title varchar(255)");
  await query("alter table cvs add column if not exists file_name varchar(255)");
  await query("alter table cvs add column if not exists file_size integer");
  await query("alter table cvs add column if not exists file_url text");
  await query("alter table cvs add column if not exists type varchar(50) default 'uploaded'");
  await query("alter table cvs add column if not exists uploaded_at timestamp default now()");
  
  // Bá» rÃ ng buá»™c NOT NULL cá»§a cá»™t file_type (náº¿u cÃ³ tá»« trÆ°á»›c) Ä‘á»ƒ Ä‘áº£m báº£o khÃ´ng bá»‹ lá»—i constraints
  try {
    await query("alter table cvs alter column file_type drop not null");
  } catch (err) {
    // Bá» qua náº¿u cá»™t file_type khÃ´ng tá»“n táº¡i
  }

  // Chuyá»ƒn kiá»ƒu dá»¯ liá»‡u cá»™t file_type tá»« enum sang varchar Ä‘á»ƒ lÆ°u trá»¯ Ä‘Æ°á»£c cÃ¡c Ä‘á»‹nh dáº¡ng má»›i nhÆ° image/jpeg, image/png...
  try {
    await query("alter table cvs alter column file_type type varchar(255) using file_type::varchar");
  } catch (err) {
    // Bá» qua náº¿u khÃ´ng thá»ƒ alter hoáº·c cá»™t khÃ´ng tá»“n táº¡i
  }

  // Bá» NOT NULL vÃ  Ä‘áº·t default cho cá»™t status (kiá»ƒu cv_status enum cÅ©)
  try {
    await query("alter table cvs alter column status drop not null");
  } catch (err) {
    // Bá» qua náº¿u cá»™t khÃ´ng tá»“n táº¡i
  }
  try {
    await query("alter table cvs add column if not exists file_url text");
  } catch (err) {
    // ignore
  }
  // Make file_url nullable for CV Builder (no file)
  try {
    await query("alter table cvs alter column file_url drop not null");
  } catch (err) {
    // ignore
  }
  // Add columns for CV Builder
  try {
    await query("alter table cvs add column if not exists content jsonb");
  } catch (err) {
    // ignore
  }
  try {
    await query("alter table cvs add column if not exists template_id varchar(100)");
  } catch (err) {
    // ignore
  }
  await query("alter table cvs add column if not exists cv_text_cache text");

  // âœ… FIX: ThÃªm cÃ¡c cá»™t thÃ´ng tin á»©ng viÃªn cáº§n thiáº¿t cho AI Interview
  await query("alter table cvs add column if not exists full_name varchar(255)");
  await query("alter table cvs add column if not exists email varchar(255)");
  await query("alter table cvs add column if not exists phone varchar(50)");
  await query("alter table cvs add column if not exists address text");
  await query("alter table cvs add column if not exists objective text");
  await query("alter table cvs add column if not exists experience jsonb");
  await query("alter table cvs add column if not exists education jsonb");
  await query("alter table cvs add column if not exists skills jsonb");
  await query("alter table cvs add column if not exists certifications jsonb");
  await query("alter table cvs add column if not exists languages jsonb");
  await query("alter table cvs add column if not exists created_at timestamp default now()");
  await query("alter table cvs add column if not exists updated_at timestamp default now()");

  // Báº£ng interview_sessions cho AI mock interview
  await query(`
    create table if not exists interview_sessions (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      cv_id uuid not null references cvs(id) on delete cascade,
      type varchar(50) default 'voice',
      level varchar(50) default 'junior',
      status varchar(50) default 'in_progress',
      conversation jsonb default '[]',
      total_score integer,
      content_score integer,
      voice_score integer,
      avg_volume numeric,
      pause_count integer default 0,
      avg_pause_duration numeric,
      confidence_level varchar(20) default 'medium',
      feedback text,
      strengths text[],
      weaknesses text[],
      improvements text[],
      duration_seconds integer,
      started_at timestamptz default now(),
      ended_at timestamptz,
      updated_at timestamptz,
      created_at timestamptz default now()
    )
  `);

  await query("alter table interview_sessions add column if not exists cv_id uuid references cvs(id) on delete cascade");
  await query("alter table interview_sessions add column if not exists type varchar(50) default 'voice'");
  await query("alter table interview_sessions add column if not exists level varchar(50) default 'junior'");
  await query("alter table interview_sessions add column if not exists status varchar(50) default 'in_progress'");
  await query("alter table interview_sessions add column if not exists conversation jsonb default '[]'");
  await query("alter table interview_sessions add column if not exists total_score integer");
  await query("alter table interview_sessions add column if not exists content_score integer");
  await query("alter table interview_sessions add column if not exists voice_score integer");
  await query("alter table interview_sessions add column if not exists avg_volume numeric");
  await query("alter table interview_sessions add column if not exists pause_count integer default 0");
  await query("alter table interview_sessions add column if not exists avg_pause_duration numeric");
  await query("alter table interview_sessions add column if not exists confidence_level varchar(20) default 'medium'");
  await query("alter table interview_sessions add column if not exists feedback text");
  await query("alter table interview_sessions add column if not exists strengths text[]");
  await query("alter table interview_sessions add column if not exists weaknesses text[]");
  await query("alter table interview_sessions add column if not exists improvements text[]");
  await query("alter table interview_sessions add column if not exists duration_seconds integer");
  await query("alter table interview_sessions add column if not exists ended_at timestamptz");
  await query("alter table interview_sessions add column if not exists updated_at timestamptz");
  await query("alter table interview_sessions add column if not exists created_at timestamptz default now()");
  await query("alter table interview_sessions add column if not exists started_at timestamptz default now()");

  // ============ GROUPS TABLES ============
  // Báº£ng groups cho phÃ©p táº¡o nhÃ³m
  await query(`
    create table if not exists groups (
      id uuid primary key default gen_random_uuid(),
      name varchar(255) not null,
      description text,
      job_category varchar(255),
      experience_level varchar(100),
      position varchar(255),
      location varchar(255),
      creator_id uuid not null references users(id) on delete cascade,
      is_private boolean default true,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // ThÃªm cÃ¡c cá»™t má»›i náº¿u chÆ°a tá»“n táº¡i (cho database Ä‘Ã£ cÃ³ sáºµn)
  await query("alter table groups add column if not exists job_category varchar(255)");
  await query("alter table groups add column if not exists experience_level varchar(100)");
  await query("alter table groups add column if not exists position varchar(255)");
  await query("alter table groups add column if not exists location varchar(255)");
  await query("alter table groups add column if not exists status varchar(50) default 'active'");
  await query("alter table groups add column if not exists warning_message text");
  await query("alter table groups add column if not exists warning_until timestamptz");
  await query("alter table groups add column if not exists ban_until timestamptz");

  // Báº£ng group_members lÆ°u thÃ nh viÃªn cá»§a nhÃ³m
  await query(`
    create table if not exists group_members (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      user_id uuid not null references users(id) on delete cascade,
      role varchar(50) default 'member',
      joined_at timestamp default now(),
      unique(group_id, user_id)
    )
  `);

  // Báº£ng group_posts cho bÃ i viáº¿t trong nhÃ³m
  await query(`
    create table if not exists group_posts (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      author_id uuid not null references users(id) on delete cascade,
      title varchar(500) not null,
      content text not null,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  await query(`
    create table if not exists group_post_likes (
      id uuid primary key default gen_random_uuid(),
      post_id uuid not null references group_posts(id) on delete cascade,
      user_id uuid not null references users(id) on delete cascade,
      reaction_type varchar(20) not null default 'like',
      created_at timestamp default now(),
      unique(post_id, user_id)
    )
  `);

  await query("alter table group_post_likes add column if not exists reaction_type varchar(20) not null default 'like'");

  await query(`
    create table if not exists group_post_comments (
      id uuid primary key default gen_random_uuid(),
      post_id uuid not null references group_posts(id) on delete cascade,
      parent_comment_id uuid references group_post_comments(id) on delete cascade,
      author_id uuid not null references users(id) on delete cascade,
      content text not null,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  await query("alter table group_post_comments add column if not exists parent_comment_id uuid references group_post_comments(id) on delete cascade");

  // Báº£ng group_messages lÆ°u trá»¯ tin nháº¯n trÃ² chuyá»‡n cá»§a nhÃ³m
  await query(`
    create table if not exists group_messages (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      sender_id uuid not null references users(id) on delete cascade,
      message text not null,
      created_at timestamp default now()
    )
  `);

  // Táº¡o indexes cho groups
  await query("create index if not exists idx_group_messages_group_id on group_messages(group_id)");
  await query("create index if not exists idx_group_messages_created_at on group_messages(created_at)");
  await query("create index if not exists idx_group_members_group_id on group_members(group_id)");
  await query("create index if not exists idx_group_members_user_id on group_members(user_id)");
  await query("create index if not exists idx_group_posts_group_id on group_posts(group_id)");
  await query("create index if not exists idx_group_post_likes_post_id on group_post_likes(post_id)");
  await query("create index if not exists idx_group_post_likes_user_id on group_post_likes(user_id)");
  await query("create index if not exists idx_group_post_comments_post_id on group_post_comments(post_id)");
  await query("create index if not exists idx_group_post_comments_author_id on group_post_comments(author_id)");
  await query("create index if not exists idx_group_post_comments_parent_comment_id on group_post_comments(parent_comment_id)");
  await query("create index if not exists idx_group_creator_id on groups(creator_id)");


  await query(`
    create table if not exists group_invitations (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      inviter_id uuid not null references users(id) on delete cascade,
      invitee_id uuid not null references users(id) on delete cascade,
      status varchar(20) default 'pending',
      created_at timestamp default now(),
      updated_at timestamp default now(),
      unique(group_id, invitee_id)
    )
  `);
  await query("create index if not exists idx_group_invitations_group_id on group_invitations(group_id)");
  await query("create index if not exists idx_group_invitations_invitee_id on group_invitations(invitee_id)");
  await query("create index if not exists idx_group_invitations_status on group_invitations(status)");

  await query(`
    create table if not exists group_violation_reports (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      reporter_id uuid not null references users(id) on delete cascade,
      target_user_id uuid references users(id) on delete set null,
      target_type varchar(50) not null default 'general',
      target_id uuid,
      reason text not null,
      status varchar(30) not null default 'pending',
      reviewed_by uuid references users(id) on delete set null,
      reviewed_at timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `);
  await query("alter table group_violation_reports add column if not exists evidence_image_url text");
  await query("alter table group_violation_reports add column if not exists evidence_link text");
  await query("alter table group_violation_reports add column if not exists manager_note text");
  await query("create index if not exists idx_group_violation_reports_group_id on group_violation_reports(group_id)");
  await query("create index if not exists idx_group_violation_reports_status on group_violation_reports(status)");

  await query(`
    create table if not exists group_ban_appeals (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      appellant_id uuid not null references users(id) on delete cascade,
      reason text not null,
      evidence_link text,
      status varchar(30) not null default 'pending',
      reviewed_by uuid references users(id) on delete set null,
      reviewed_at timestamptz,
      admin_note text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `);
  await query("create index if not exists idx_group_ban_appeals_group_id on group_ban_appeals(group_id)");
  await query("create index if not exists idx_group_ban_appeals_status on group_ban_appeals(status)");

  await query(`
    create table if not exists group_member_violations (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      user_id uuid not null references users(id) on delete cascade,
      manager_id uuid references users(id) on delete set null,
      violation_count integer not null,
      message text not null,
      status varchar(50) not null,
      warning_start_at timestamptz,
      warning_end_at timestamptz,
      ban_start_at timestamptz,
      ban_end_at timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `);
  await query("create index if not exists idx_group_member_violations_group_user on group_member_violations(group_id, user_id)");
  await query("create index if not exists idx_group_member_violations_status on group_member_violations(status)");

  await query(`
    create table if not exists group_member_warning_views (
      id uuid primary key default gen_random_uuid(),
      violation_id uuid not null references group_member_violations(id) on delete cascade,
      user_id uuid not null references users(id) on delete cascade,
      viewed_date date not null default current_date,
      viewed_at timestamptz default now(),
      unique(violation_id, user_id, viewed_date)
    )
  `);

  await query(`
    create table if not exists group_status_violations (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      manager_web_id uuid references users(id) on delete set null,
      violation_count integer not null,
      message text not null,
      status varchar(50) not null,
      warning_start_at timestamptz,
      warning_end_at timestamptz,
      ban_start_at timestamptz,
      ban_end_at timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    )
  `);
  await query("create index if not exists idx_group_status_violations_group_id on group_status_violations(group_id)");
  await query("create index if not exists idx_group_status_violations_status on group_status_violations(status)");

  await query(`
    create table if not exists group_status_warning_views (
      id uuid primary key default gen_random_uuid(),
      violation_id uuid not null references group_status_violations(id) on delete cascade,
      user_id uuid not null references users(id) on delete cascade,
      viewed_date date not null default current_date,
      viewed_at timestamptz default now(),
      unique(violation_id, user_id, viewed_date)
    )
  `);

  // Thêm cột subscription vào users
  await query("alter table users add column if not exists subscription_plan varchar(20) default 'free'");
  await query("alter table users add column if not exists subscription_expires_at timestamp");
  
  await query("alter table users add column if not exists sub_plan_interview varchar(50) default 'free'");
  await query("alter table users add column if not exists sub_expires_interview timestamp");
  await query("alter table users add column if not exists sub_plan_cv varchar(50) default 'free'");
  await query("alter table users add column if not exists sub_expires_cv timestamp");


  await query(`
    create table if not exists user_subscriptions (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      plan varchar(50) not null,
      status varchar(20) default 'active',
      started_at timestamp default now(),
      expires_at timestamp,
      created_at timestamp default now()
    )
  `);
  await query("create index if not exists idx_user_subscriptions_user_id on user_subscriptions(user_id)");
  
  try {
    await query("alter table user_subscriptions alter column plan type varchar(50)");
  } catch (err) {
    // ignore if table doesn't exist yet or already altered
  }

 
  try {
    const colType = await query(`
      SELECT data_type FROM information_schema.columns
      WHERE table_name = 'user_addon_purchases' AND column_name = 'user_id'
    `);
    if (colType.rows.length > 0 && colType.rows[0].data_type !== 'uuid') {
      await query(`DROP TABLE IF EXISTS user_addon_purchases`);
    }
  } catch {}

  await query(`
    CREATE TABLE IF NOT EXISTS user_addon_purchases (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      addon_id VARCHAR(100) NOT NULL,
      addon_name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'completed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query("CREATE INDEX IF NOT EXISTS idx_user_addon_purchases_user_id ON user_addon_purchases(user_id)");


  await query(`
    create table if not exists notifications (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      sender_id uuid references users(id) on delete set null,
      sender_name varchar(255) not null,
      sender_role varchar(50) not null,
      title varchar(255) not null,
      message text not null,
      type varchar(50) default 'info',
      is_read boolean default false,
      created_at timestamp default now()
    )
  `);
  await query("create index if not exists idx_notifications_user_id on notifications(user_id)");
  await query("create index if not exists idx_notifications_is_read on notifications(is_read)");
  await query("alter table notifications add column if not exists link varchar(500)");


  await query(`
    create table if not exists reminders (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      title varchar(255) not null,
      description text,
      reminder_type varchar(50) not null default 'once',
      frequency varchar(20) default 'once',
      day_of_week integer,
      day_of_month integer,
      time_of_day time not null,
      start_date date,
      end_date date,
      is_active boolean default true,
      last_sent_at timestamp,
      next_send_at timestamp,
      notification_channel varchar(20) default 'in_app',
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);


  await query(`
    create table if not exists reminder_logs (
      id uuid primary key default gen_random_uuid(),
      reminder_id uuid not null references reminders(id) on delete cascade,
      sent_at timestamp default now(),
      status varchar(20) default 'sent',
      error_message text
    )
  `);

  await query("create index if not exists idx_reminders_user_id on reminders(user_id)");
  await query("create index if not exists idx_reminders_is_active on reminders(is_active)");
  await query("create index if not exists idx_reminders_next_send_at on reminders(next_send_at)");
  await query("create index if not exists idx_reminder_logs_reminder_id on reminder_logs(reminder_id)");

  
  await query(`
    create table if not exists friendships (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      friend_id uuid not null references users(id) on delete cascade,
      status varchar(20) default 'pending', -- 'pending', 'accepted', 'declined'
      created_at timestamp default now(),
      updated_at timestamp default now(),
      unique(user_id, friend_id),
      constraint chk_friendships_users check (user_id <> friend_id)
    )
  `);


  await query(`
    create table if not exists direct_messages (
      id uuid primary key default gen_random_uuid(),
      sender_id uuid not null references users(id) on delete cascade,
      receiver_id uuid not null references users(id) on delete cascade,
      message text not null,
      is_read boolean default false,
      created_at timestamp default now()
    )
  `);

  // Bảng blog_comments lưu bình luận bài viết
  await query(`
    create table if not exists blog_comments (
      id uuid primary key default gen_random_uuid(),
      post_id uuid not null,
      user_id uuid not null references users(id) on delete cascade,
      content text not null,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Bảng transactions lưu lịch sử giao dịch thanh toán
  await query(`
    create table if not exists transactions (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references users(id) on delete cascade,
      item_type varchar(50) not null,
      item_id varchar(100) not null,
      item_name varchar(255) not null,
      amount integer not null,
      payment_method varchar(100) not null,
      status varchar(20) not null default 'completed',
      created_at timestamp default now()
    )
  `);

  await query("create index if not exists idx_blog_comments_post_id on blog_comments(post_id)");
  await query("create index if not exists idx_transactions_user_id on transactions(user_id)");

  await query("create index if not exists idx_friendships_user_id on friendships(user_id)");
  await query("create index if not exists idx_friendships_friend_id on friendships(friend_id)");
  await query("create index if not exists idx_friendships_status on friendships(status)");
  await query("create index if not exists idx_direct_messages_sender_id on direct_messages(sender_id)");
  await query("create index if not exists idx_direct_messages_receiver_id on direct_messages(receiver_id)");
  await query("create index if not exists idx_direct_messages_created_at on direct_messages(created_at)");

  // Táº¡o indexes
  // XÃ³a unique constraint vÃ  unique index cÅ© trÃªn email Ä‘Æ¡n láº» (khÃ´ng cÃ²n phÃ¹ há»£p vÃ¬ cho phÃ©p cÃ¹ng email vá»›i provider khÃ¡c nhau)
  await query("alter table users drop constraint if exists users_email_key");
  await query("drop index if exists idx_users_email");
  await query("drop index if exists idx_users_email_unique");
  // Unique composite: cÃ¹ng email + cÃ¹ng provider thÃ¬ má»›i coi lÃ  trÃ¹ng
  await query(
    "create unique index if not exists idx_users_email_provider on users(email, auth_provider) where email is not null"
  );
  await query("create unique index if not exists idx_users_google_id on users(google_id) where google_id is not null");
  await query("create unique index if not exists idx_users_phone on users(phone) where phone is not null");
  await query("create index if not exists idx_users_otp_verified on users(otp_verified)");
  await query("create index if not exists idx_user_profiles_user_id on user_profiles(user_id)");

  // Seed/Migrate default admin account if configured in env
  const adminEmail = process.env.ADMIN_EMAIL || "admin@jobreadyai.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    // 1. Tá»± Ä‘á»™ng chuyá»ƒn Ä‘á»•i tÃ i khoáº£n admin cÅ© tá»« phone sang email (náº¿u cÃ³)
    const oldAdminCheck = await query("select id, phone from users where role = 'admin' and phone is not null and email is null");
    if (oldAdminCheck.rows.length > 0) {
      console.log(`Migrating old admin account with phone ${oldAdminCheck.rows[0].phone} to email: ${adminEmail}`);
      await query(
        `update users set email = $1, phone = null, auth_provider = 'email', otp_verified = true, status = 'active' where role = 'admin'`,
        [adminEmail]
      );
    }

    // 2. Kiá»ƒm tra tÃ i khoáº£n admin theo email hiá»‡n táº¡i
    const adminCheck = await query("select id, password_hash from users where email = $1 and auth_provider = 'email'", [adminEmail]);
    
    if (adminCheck.rows.length === 0) {
      console.log(`Seeding default admin account with email: ${adminEmail}`);
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await withTransaction(async (client) => {
        const userResult = await client.query(
          `
            insert into users (email, password_hash, auth_provider, otp_verified, status, role)
            values ($1, $2, 'email', true, 'active', 'admin')
            returning id
          `,
          [adminEmail, hashedPassword]
        );
        const adminUser = userResult.rows[0];
        
        await client.query(
          `
            insert into user_profiles (user_id, full_name, profile_completed)
            values ($1, 'System Administrator', true)
            on conflict (user_id) do update set profile_completed = true
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
        console.log(`Updating password for admin account with email: ${adminEmail}...`);
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await query("update users set password_hash = $1 where id = $2", [hashedPassword, adminUser.id]);
        console.log("Admin password updated successfully in database.");
      }
    }
  }

  // Ensure blog_posts has language column
  try {
    await query("alter table blog_posts add column if not exists language varchar(10) default 'vi'");
  } catch (err) {
    console.error("Error adding language column:", err);
  }

  // Always ensure English blog posts exist
  const englishPosts = [
    {
      title: "10 Important Criteria When Choosing a CV for Recruiters",
      content: `When receiving hundreds of applications, recruiters usually spend only 6-10 seconds scanning each CV. Here are 10 important criteria to help you understand what makes your CV stand out:

1. Clear Personal Information
Ensure your full name, phone number, and contact email are placed prominently. Avoid unnecessary information like ID number or marital status.

2. Professional Summary (Profile Summary)
A 2-3 sentence summary about yourself, highlighting key skills and career objectives.

3. Well-Structured Work Experience
Use the structure: Job Title - Company Name - Time Period - Job Description (with bullet points). Emphasize specific achievements with data.

4. Skills Relevant to the Position
List hard skills (technical) and soft skills (interpersonal) that match the job description.

5. Education and Certifications
Focus on professional certifications and relevant courses.

6. Professional Formatting
Readable font (Arial, Calibri), font size 10-12pt, aligned. PDF is the safest format to preserve layout.

7. No Spelling Errors
Read it over multiple times. Use spell-checking tools.

8. Appropriate Length
1-2 pages for candidates with less than 10 years of experience.

9. Keywords from Job Description
Many companies use ATS (Applicant Tracking System) to filter CVs.

10. Portfolio/Project Links
If you have an online portfolio, include the link in your CV.`,
      excerpt: "Discover 10 important criteria to make your CV impress recruiters.",
      category: "CV Criteria",
    },
    {
      title: "How to Write a Career Objective That Attracts Recruiters",
      content: `A career objective is a brief but extremely important section on your CV. It defines who you are and what you want.

Structure of an Effective Objective:
1. Desired position + Industry
2. Key skills you bring
3. Value you can contribute

Good Example:
"Accountant with 3 years of experience in the manufacturing industry. Proficient in advanced Excel, SAP accounting software. Seeking a Senior Accountant position to apply financial management skills."

Important Notes:
- Customize for each application
- No more than 3-4 lines
- Use keywords from the job description
- Place at the top of CV, after personal information`,
      excerpt: "Detailed guide on writing an impressive career objective, tailored to each position.",
      category: "Job Criteria",
    },
    {
      title: "7 Common Interview Questions and How to Answer Them Well",
      content: `Interview is an opportunity to show not only your skills but also your personality and cultural fit.

1. "Tell me about yourself"
Don't repeat your entire CV. Focus on 2-3 strengths directly related to the position.

2. "What are your strengths and weaknesses?"
Strengths: Choose 2-3 that match the job description, with specific examples.
Weaknesses: Choose a real weakness but not too serious, and show you're improving it.

3. "Why do you want to work at our company?"
Research the company beforehand. Connect your values with the company's mission/culture.

4. "Where do you see yourself in 5 years?"
Show appropriate ambition. Balance personal goals with contributions to the company.

5. "Describe a challenge and how you overcame it"
Choose a work-related example. Use the STAR method: Situation, Task, Action, Result.

6. "Do you have any questions for us?"
ALWAYS have questions! Ask about the team, company culture, development opportunities.

7. "Tell me about a successful project of yours"
Choose a project that demonstrates skills essential for the position.`,
      excerpt: "Summary of 7 most common interview questions with professional answer strategies.",
      category: "Interview Tips",
    },
    {
      title: "Recruitment Trends 2024-2025 in Vietnam",
      content: `The Vietnamese labor market is changing rapidly. Here are the trends to help you prepare better:

1. Hybrid Work - Combined Work Model
Many companies apply hybrid models. 60% of IT companies allow remote work 2-3 days/week.

2. Digital Skills Are Mandatory
Basic digital skills like advanced Excel and collaboration tools are becoming minimum requirements.

3. AI Skills - AI Competency
Understanding how to use AI tools to increase productivity is a major advantage.

4. Soft Skills Are Highly Valued
Interpersonal skills like communication and problem-solving are valued more than hard skills.

5. Upskilling and Reskilling
Continuous learning is no longer optional. Online courses are very popular.

6. Tech Roles Still Lead
Software Engineer, Data Analyst, Cloud Engineer are the positions with highest demand.`,
      excerpt: "Detailed analysis of prominent recruitment trends in Vietnam 2024-2025.",
      category: "Recruitment Trends",
    },
    {
      title: "How to Answer Questions About Desired Salary",
      content: `Salary questions often make candidates confused. Here are smart answer strategies:

Golden Rules:
1. DON'T give the first number if possible
2. Research market salary first
3. Show flexibility while knowing your worth

Strategy 1: Redirect the question
"Could you tell me what the salary range for this position is?"

Strategy 2: Give a range (with basis)
"Based on research, the appropriate salary for this position is 20-25 million."

Strategy 3: Talk about value
"I believe the salary will reflect the value I bring."

When You Must Give a Number:
- Research on Glassdoor, Vietnamwork, CareerViet
- Know your minimum acceptable salary
- Always leave 10-15% buffer for negotiation`,
      excerpt: "Detailed guide on how to answer salary questions professionally.",
      category: "Job Criteria",
    },
  ];

  try {
    const existingEn = await query("SELECT title FROM blog_posts WHERE language = 'en'");
    const existingEnTitles = new Set(existingEn.rows.map((r) => r.title));
    let insertedEn = 0;
    for (const post of englishPosts) {
      if (!existingEnTitles.has(post.title)) {
        await query(
          `INSERT INTO blog_posts (title, content, excerpt, category, author, language) VALUES ($1, $2, $3, $4, $5, 'en')`,
          [post.title, post.content, post.excerpt, post.category, "JobReady AI"]
        );
        insertedEn++;
      }
    }
    if (insertedEn > 0) console.log(`Seeded ${insertedEn} English blog posts.`);
  } catch (err) {
    console.error("Error seeding English blog posts:", err);
  }

  // Seed Vietnamese blog posts if table is empty
  const blogCheck = await query("SELECT COUNT(*) as count FROM blog_posts");
  if (parseInt(blogCheck.rows[0].count) === 0) {
    console.log("Seeding sample blog posts...");
    const samplePosts = [
      {
        title: "10 TiÃªu ChÃ­ Quan Trá»ng Khi Chá»n CV Cho NhÃ  Tuyá»ƒn Dá»¥ng",
        content: `Khi nháº­n Ä‘Æ°á»£c hÃ ng trÄƒm há»“ sÆ¡ á»©ng tuyá»ƒn, nhÃ  tuyá»ƒn dá»¥ng thÆ°á»ng chá»‰ dÃ nh 6-10 giÃ¢y Ä‘á»ƒ lÆ°á»›t qua má»—i CV. DÆ°á»›i Ä‘Ã¢y lÃ  10 tiÃªu chÃ­ quan trá»ng giÃºp báº¡n hiá»ƒu Ä‘iá»u gÃ¬ khiáº¿n CV cá»§a báº¡n ná»•i báº­t:

1. ThÃ´ng Tin CÃ¡ NhÃ¢n RÃµ RÃ ng
Äáº£m báº£o tÃªn Ä‘áº§y Ä‘á»§, sá»‘ Ä‘iá»‡n thoáº¡i, email liÃªn láº¡c Ä‘Æ°á»£c Ä‘áº·t á»Ÿ vá»‹ trÃ­ dá»… tháº¥y. TrÃ¡nh thÃ´ng tin thá»«a nhÆ° sá»‘ CMND, tÃ¬nh tráº¡ng hÃ´n nhÃ¢n.

2. TÃ³m Táº¯t ChuyÃªn MÃ´n (Profile Summary)
Má»™t Ä‘oáº¡n tÃ³m táº¯t 2-3 cÃ¢u vá» báº£n thÃ¢n, highlight ká»¹ nÄƒng chÃ­nh vÃ  má»¥c tiÃªu nghá» nghiá»‡p.

3. Kinh Nghiá»‡m LÃ m Viá»‡c ÄÆ°á»£c TrÃ¬nh BÃ y Tá»‘t
Sá»­ dá»¥ng cáº¥u trÃºc: Chá»©c danh - TÃªn cÃ´ng ty - Thá»i gian - MÃ´ táº£ cÃ´ng viá»‡c (vá»›i bullet points). Nháº¥n máº¡nh thÃ nh tÃ­ch cá»¥ thá»ƒ báº±ng sá»‘ liá»‡u.

4. Ká»¹ NÄƒng PhÃ¹ Há»£p Vá»›i Vá»‹ TrÃ­
Liá»‡t kÃª ká»¹ nÄƒng hard skills (ká»¹ thuáº­t) vÃ  soft skills (má»m) phÃ¹ há»£p vá»›i job description.

5. Há»c Váº¥n vÃ  Chá»©ng Chá»‰
Táº­p trung vÃ o chá»©ng chá»‰ chuyÃªn mÃ´n, khÃ³a há»c liÃªn quan.

6. Äá»‹nh Dáº¡ng ChuyÃªn Nghiá»‡p
Font dá»… Ä‘á»c (Arial, Calibri), cá»¡ chá»¯ 10-12pt, lá» Ä‘á»u. PDF lÃ  Ä‘á»‹nh dáº¡ng an toÃ n nháº¥t Ä‘á»ƒ giá»¯ format.

7. KhÃ´ng CÃ³ Lá»—i ChÃ­nh Táº£
Äá»c Ä‘i Ä‘á»c láº¡i nhiá»u láº§n. Sá»­ dá»¥ng cÃ´ng cá»¥ kiá»ƒm tra chÃ­nh táº£.

8. Äá»™ DÃ i PhÃ¹ Há»£p
1-2 trang cho á»©ng viÃªn cÃ³ dÆ°á»›i 10 nÄƒm kinh nghiá»‡m.

9. Tá»« KhÃ³a Theo JD
Nhiá»u cÃ´ng ty sá»­ dá»¥ng ATS (Applicant Tracking System) Ä‘á»ƒ lá»c CV.

10. LiÃªn Káº¿t Portfolio/Dá»± Ãn
Náº¿u báº¡n cÃ³ portfolio online, Ä‘Æ°a link vÃ o CV.`,
        excerpt: "KhÃ¡m phÃ¡ 10 tiÃªu chÃ­ quan trá»ng giÃºp CV cá»§a báº¡n gÃ¢y áº¥n tÆ°á»£ng vá»›i nhÃ  tuyá»ƒn dá»¥ng.",
        category: "TiÃªu chÃ­ chá»n CV",
      },
      {
        title: "CÃ¡ch Viáº¿t Má»¥c TiÃªu Nghá» Nghiá»‡p Thu HÃºt NhÃ  Tuyá»ƒn Dá»¥ng",
        content: `Má»¥c tiÃªu nghá» nghiá»‡p lÃ  pháº§n ngáº¯n gá»n nhÆ°ng cá»±c ká»³ quan trá»ng trÃªn CV. NÃ³ Ä‘á»‹nh vá»‹ báº¡n lÃ  ai vÃ  what you want.

Cáº¥u TrÃºc Má»™t Má»¥c TiÃªu Hiá»‡u Quáº£:
1. Vá»‹ trÃ­ mong muá»‘n + LÄ©nh vá»±c
2. Ká»¹ nÄƒng chÃ­nh mang láº¡i
3. GiÃ¡ trá»‹ báº¡n cÃ³ thá»ƒ Ä‘Ã³ng gÃ³p

VÃ­ Dá»¥ Tá»‘t:
"Káº¿ toÃ¡n tá»•ng há»£p vá»›i 3 nÄƒm kinh nghiá»‡m trong lÄ©nh vá»±c sáº£n xuáº¥t. ThÃ nh tháº¡o Excel nÃ¢ng cao, pháº§n má»m káº¿ toÃ¡n SAP. TÃ¬m kiáº¿m vá»‹ trÃ­ Káº¿ toÃ¡n trÆ°á»Ÿng Ä‘á»ƒ Ã¡p dá»¥ng ká»¹ nÄƒng quáº£n lÃ½ tÃ i chÃ­nh."

LÆ°u Ã Quan Trá»ng:
- Äiá»u chá»‰nh theo tá»«ng Ä‘Æ¡n á»©ng tuyá»ƒn
- KhÃ´ng quÃ¡ 3-4 dÃ²ng
- Sá»­ dá»¥ng tá»« khÃ³a tá»« job description
- Äáº·t á»Ÿ vá»‹ trÃ­ Ä‘áº§u CV, sau thÃ´ng tin cÃ¡ nhÃ¢n`,
        excerpt: "HÆ°á»›ng dáº«n chi tiáº¿t cÃ¡ch viáº¿t má»¥c tiÃªu nghá» nghiá»‡p áº¥n tÆ°á»£ng, phÃ¹ há»£p vá»›i tá»«ng vá»‹ trÃ­.",
        category: "TiÃªu chÃ­ xin viá»‡c",
      },
      {
        title: "7 CÃ¢u Há»i Phá»ng Váº¥n ThÆ°á»ng Gáº·p VÃ  CÃ¡ch Tráº£ Lá»i Hay",
        content: `Phá»ng váº¥n lÃ  cÆ¡ há»™i Ä‘á»ƒ báº¡n thá»ƒ hiá»‡n khÃ´ng chá»‰ nÄƒng lá»±c mÃ  cÃ²n cÃ¡ tÃ­nh vÃ  vÄƒn hÃ³a phÃ¹ há»£p.

1. "HÃ£y giá»›i thiá»‡u vá» báº£n thÃ¢n"
KhÃ´ng láº·p láº¡i toÃ n bá»™ CV. Táº­p trung vÃ o 2-3 Ä‘iá»ƒm máº¡nh liÃªn quan trá»±c tiáº¿p Ä‘áº¿n vá»‹ trÃ­ á»©ng tuyá»ƒn.

2. "Äiá»ƒm máº¡nh vÃ  Ä‘iá»ƒm yáº¿u cá»§a báº¡n lÃ  gÃ¬?"
Äiá»ƒm máº¡nh: Chá»n 2-3 Ä‘iá»ƒm phÃ¹ há»£p vá»›i job description, kÃ¨m vÃ­ dá»¥ cá»¥ thá»ƒ.
Äiá»ƒm yáº¿u: Chá»n Ä‘iá»ƒm yáº¿u tháº­t nhÆ°ng khÃ´ng quÃ¡ nghiÃªm trá»ng, vÃ  báº¡n Ä‘ang cáº£i thiá»‡n nÃ³.

3. "Táº¡i sao báº¡n muá»‘n lÃ m viá»‡c táº¡i cÃ´ng ty chÃºng tÃ´i?"
NghiÃªn cá»©u ká»¹ vá» cÃ´ng ty trÆ°á»›c. Káº¿t ná»‘i giÃ¡ trá»‹ cá»§a báº¡n vá»›i mission/culture cá»§a cÃ´ng ty.

4. "Báº¡n tháº¥y mÃ¬nh 5 nÄƒm tá»›i á»Ÿ Ä‘Ã¢u?"
Thá»ƒ hiá»‡n ambition phÃ¹ há»£p. Káº¿t há»£p giá»¯a má»¥c tiÃªu cÃ¡ nhÃ¢n vÃ  Ä‘Ã³ng gÃ³p cho cÃ´ng ty.

5. "MÃ´ táº£ má»™t thá»­ thÃ¡ch vÃ  cÃ¡ch báº¡n vÆ°á»£t qua nÃ³"
Chá»n má»™t vÃ­ dá»¥ liÃªn quan Ä‘áº¿n cÃ´ng viá»‡c. Sá»­ dá»¥ng STAR method: Situation, Task, Action, Result.

6. "Báº¡n cÃ³ cÃ¢u há»i gÃ¬ cho chÃºng tÃ´i?"
LUÃ”N LUÃ”N cÃ³ cÃ¢u há»i! Há»i vá» Ä‘á»™i nhÃ³m, vÄƒn hÃ³a cÃ´ng ty, cÆ¡ há»™i phÃ¡t triá»ƒn.

7. "Ká»ƒ vá» má»™t dá»± Ã¡n thÃ nh cÃ´ng cá»§a báº¡n"
Chá»n dá»± Ã¡n thá»ƒ hiá»‡n ká»¹ nÄƒng cáº§n thiáº¿t cho vá»‹ trÃ­.`,
        excerpt: "Tá»•ng há»£p 7 cÃ¢u há»i phá»ng váº¥n phá»• biáº¿n nháº¥t kÃ¨m cÃ¡ch tráº£ lá»i chuyÃªn nghiá»‡p.",
        category: "Máº¹o phá»ng váº¥n",
      },
      {
        title: "Xu HÆ°á»›ng Tuyá»ƒn Dá»¥ng 2024-2025 Táº¡i Viá»‡t Nam",
        content: `Thá»‹ trÆ°á»ng lao Ä‘á»™ng Viá»‡t Nam Ä‘ang thay Ä‘á»•i nhanh chÃ³ng. Náº¯m báº¯t xu hÆ°á»›ng giÃºp báº¡n chuáº©n bá»‹ tá»‘t hÆ¡n:

1. Hybrid Work - LÃ m Viá»‡c Káº¿t Há»£p
Nhiá»u cÃ´ng ty Ã¡p dá»¥ng mÃ´ hÃ¬nh hybrid. 60% doanh nghiá»‡p CNTT cho phÃ©p lÃ m viá»‡c tá»« xa 2-3 ngÃ y/tuáº§n.

2. Ká»¹ NÄƒng Sá»‘ HÃ³a LÃ  Báº¯t Buá»™c
Ká»¹ nÄƒng sá»‘ cÆ¡ báº£n nhÆ° Excel nÃ¢ng cao, cÃ´ng cá»¥ collaboration Ä‘ang trá»Ÿ thÃ nh yÃªu cáº§u tá»‘i thiá»ƒu.

3. AI Skills - Ká»¹ NÄƒng AI
Hiá»ƒu cÃ¡ch sá»­ dá»¥ng AI tools Ä‘á»ƒ tÄƒng nÄƒng suáº¥t lÃ  lá»£i tháº¿ lá»›n.

4. Soft Skills ÄÆ°á»£c Äá» Cao
Ká»¹ nÄƒng má»m nhÆ° giao tiáº¿p, giáº£i quyáº¿t váº¥n Ä‘á» khÃ³ Ä‘Ã o táº¡o hÆ¡n hard skills.

5. Upskilling vÃ  Reskilling
Há»c táº­p liÃªn tá»¥c khÃ´ng cÃ²n lÃ  lá»±a chá»n. CÃ¡c khÃ³a há»c online Ä‘ang ráº¥t phá»• biáº¿n.

6. Tech Roles Váº«n Dáº«n Äáº§u
Software Engineer, Data Analyst, Cloud Engineer lÃ  nhá»¯ng vá»‹ trÃ­ cÃ³ nhu cáº§u cao nháº¥t.`,
        excerpt: "PhÃ¢n tÃ­ch chi tiáº¿t cÃ¡c xu hÆ°á»›ng tuyá»ƒn dá»¥ng ná»•i báº­t táº¡i Viá»‡t Nam 2024-2025.",
        category: "Xu hÆ°á»›ng tuyá»ƒn dá»¥ng",
      },
      {
        title: "CÃ¡ch Tráº£ Lá»i CÃ¢u Há»i Vá» Má»©c LÆ°Æ¡ng Mong Muá»‘n",
        content: `CÃ¢u há»i vá» má»©c lÆ°Æ¡ng thÆ°á»ng khiáº¿n á»©ng viÃªn lÃºng tÃºng. DÆ°á»›i Ä‘Ã¢y lÃ  chiáº¿n lÆ°á»£c tráº£ lá»i thÃ´ng minh:

NguyÃªn Táº¯c VÃ ng:
1. KHÃ”NG Ä‘Æ°a ra con sá»‘ Ä‘áº§u tiÃªn náº¿u cÃ³ thá»ƒ
2. NghiÃªn cá»©u má»©c lÆ°Æ¡ng thá»‹ trÆ°á»ng trÆ°á»›c
3. Thá»ƒ hiá»‡n sá»± linh hoáº¡t nhÆ°ng biáº¿t giÃ¡ trá»‹ cá»§a mÃ¬nh

Chiáº¿n LÆ°á»£c 1: Pháº£n láº¡i cÃ¢u há»i
"Anh/Chá»‹ cÃ³ thá»ƒ cho biáº¿t má»©c lÆ°Æ¡ng cho vá»‹ trÃ­ nÃ y lÃ  bao nhiÃªu áº¡?"

Chiáº¿n LÆ°á»£c 2: ÄÆ°a ra range (cÃ³ cÆ¡ sá»Ÿ)
"Dá»±a trÃªn research, má»©c lÆ°Æ¡ng phÃ¹ há»£p cho vá»‹ trÃ­ nÃ y lÃ  20-25 triá»‡u."

Chiáº¿n LÆ°á»£c 3: NÃ³i vá» giÃ¡ trá»‹
"TÃ´i tin ráº±ng má»©c lÆ°Æ¡ng sáº½ pháº£n Ã¡nh giÃ¡ trá»‹ tÃ´i mang láº¡i."

Khi ÄÃ£ Pháº£i NÃ³i Sá»‘:
- Research trÃªn Glassdoor, Vietnamwork, CareerViet
- Biáº¿t minimum acceptable salary cá»§a báº¡n
- LuÃ´n Ä‘á»ƒ buffer 10-15% Ä‘á»ƒ thÆ°Æ¡ng lÆ°á»£ng`,
        excerpt: "HÆ°á»›ng dáº«n chi tiáº¿t cÃ¡ch tráº£ lá»i vá» má»©c lÆ°Æ¡ng mong muá»‘n má»™t cÃ¡ch chuyÃªn nghiá»‡p.",
        category: "TiÃªu chÃ­ xin viá»‡c",
      },
    ];

    for (const post of samplePosts) {
      await query(
        `INSERT INTO blog_posts (title, content, excerpt, category, author, language) VALUES ($1, $2, $3, $4, $5, 'vi')`,
        [post.title, post.content, post.excerpt, post.category, "JobReady AI"]
      );
    }
    console.log("Vietnamese blog posts seeded successfully!");
  }

  try {
    const adminUserResult = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    const adminId = adminUserResult.rows[0]?.id;
    
    if (adminId) {
      const postsResult = await query("SELECT * FROM blog_posts");
      const articlesResult = await query("SELECT id FROM articles");
      const existingArticleIds = new Set(articlesResult.rows.map(r => r.id));
      
      const categoryMapReverse = {
        "TiÃªu chÃ­ chá»n CV": "cv_tips",
        "Máº¹o phá»ng váº¥n": "interview_tips",
        "Ká»¹ nÄƒng nghá» nghiá»‡p": "soft_skills",
        "TiÃªu chÃ­ xin viá»‡c": "career",
        "Xu hÆ°á»›ng tuyá»ƒn dá»¥ng": "other"
      };

      for (const post of postsResult.rows) {
        if (!existingArticleIds.has(post.id)) {
          const categoryEnum = categoryMapReverse[post.category] || "career";
          await query(
            `
              INSERT INTO articles (id, author_id, title, content, thumbnail_url, category, status, published_at, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6::article_category, 'published'::article_status, $7, $8, $9)
              ON CONFLICT (id) DO NOTHING
            `,
            [post.id, adminId, post.title, post.content, post.image_url || null, categoryEnum, post.created_at, post.created_at, post.updated_at]
          );
        }
      }
      console.log("Äá»“ng bá»™ hÃ³a blog_posts sang articles thÃ nh cÃ´ng.");
    }
  } catch (syncError) {
    console.error("Lá»—i Ä‘á»“ng bá»™ hÃ³a blog_posts sang articles:", syncError);
  }
}


