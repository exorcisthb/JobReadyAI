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

  await query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email varchar(255),
      phone varchar(20),
      google_id varchar(255),
      facebook_id varchar(255),
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
  await query("alter table users add column if not exists facebook_id varchar(255)");
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
  await query("alter table users add column if not exists language varchar(5) default 'vi'");

  await query(`
    create table if not exists deleted_test_users (
      email varchar(255) primary key,
      deleted_by uuid references users(id) on delete set null,
      deleted_at timestamp default now()
    )
  `);
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

  // Tạo bảng cvs lưu trữ CV của người dùng
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

  // Bảng blog_posts cho các bài viết career
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

  // Đảm bảo các cột cần thiết cho articles và blog_posts
  try {
    await query("alter table articles add column if not exists source_url text");
    await query("alter table blog_posts add column if not exists source_url text");
    await query("alter table blog_posts add column if not exists status varchar(50) default 'published'");
    await query("create index if not exists idx_blog_posts_status on blog_posts(status)");
  } catch (err) {
    console.error("Lỗi khi thêm cột source_url:", err);
  }

  // Đảm bảo các cột cần thiết tồn tại trong bảng cvs nếu bảng đã được tạo từ trước
  await query("alter table cvs add column if not exists title varchar(255)");
  await query("alter table cvs add column if not exists file_name varchar(255)");
  await query("alter table cvs add column if not exists file_size integer");
  await query("alter table cvs add column if not exists file_url text");
  await query("alter table cvs add column if not exists type varchar(50) default 'uploaded'");
  await query("alter table cvs add column if not exists uploaded_at timestamp default now()");
  
  // Bỏ ràng buộc NOT NULL của cột file_type (nếu có từ trước) để đảm bảo không bị lỗi constraints
  try {
    await query("alter table cvs alter column file_type drop not null");
  } catch (err) {
    // Bỏ qua nếu cột file_type không tồn tại
  }

  // Chuyển kiểu dữ liệu cột file_type từ enum sang varchar để lưu trữ được các định dạng mới như image/jpeg, image/png...
  try {
    await query("alter table cvs alter column file_type type varchar(255) using file_type::varchar");
  } catch (err) {
    // Bỏ qua nếu không thể alter hoặc cột không tồn tại
  }

  // Bỏ NOT NULL và đặt default cho cột status (kiểu cv_status enum cũ)
  try {
    await query("alter table cvs alter column status drop not null");
  } catch (err) {
    // Bỏ qua nếu cột không tồn tại
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

  // ✅ FIX: Thêm các cột thông tin ứng viên cần thiết cho AI Interview
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

  // Bảng interview_sessions cho AI mock interview
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
  // Bảng groups cho phép tạo nhóm
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

  // Thêm các cột mới nếu chưa tồn tại (cho database đã có sẵn)
  await query("alter table groups add column if not exists job_category varchar(255)");
  await query("alter table groups add column if not exists experience_level varchar(100)");
  await query("alter table groups add column if not exists position varchar(255)");
  await query("alter table groups add column if not exists location varchar(255)");
  await query("alter table groups add column if not exists status varchar(50) default 'active'");
  await query("alter table groups add column if not exists warning_message text");
  await query("alter table groups add column if not exists warning_until timestamptz");
  await query("alter table groups add column if not exists ban_until timestamptz");

  // Bảng group_members lưu thành viên của nhóm
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

  // Bảng group_posts cho bài viết trong nhóm
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

  // Bảng group_messages lưu trữ tin nhắn trò chuyện của nhóm
  await query(`
    create table if not exists group_messages (
      id uuid primary key default gen_random_uuid(),
      group_id uuid not null references groups(id) on delete cascade,
      sender_id uuid not null references users(id) on delete cascade,
      message text not null,
      created_at timestamp default now()
    )
  `);

  // Tạo indexes cho groups
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

  // Th�m c?t subscription v�o users
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

  await query("alter table user_subscriptions add column if not exists source varchar(20) default 'payment'");

  
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

  // B?ng blog_comments l?u b�nh lu?n b�i vi?t
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

  // B?ng transactions l?u l?ch s? giao d?ch thanh to�n
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

  // B?ng suspicious_activity_logs l?u c�c h�nh vi ?�ng ng?
  await query(`
    create table if not exists suspicious_activity_logs (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      ip_address varchar(100),
      activity_type varchar(50) not null,
      severity varchar(20) not null default 'medium',
      details jsonb,
      created_at timestamp default now()
    )
  `);

  await query("create index if not exists idx_suspicious_activity_logs_user_id on suspicious_activity_logs(user_id)");
  await query("create index if not exists idx_suspicious_activity_logs_ip on suspicious_activity_logs(ip_address)");
  await query("create index if not exists idx_suspicious_activity_logs_type on suspicious_activity_logs(activity_type)");
  await query("create index if not exists idx_suspicious_activity_logs_created_at on suspicious_activity_logs(created_at)");

  await query("create index if not exists idx_friendships_user_id on friendships(user_id)");
  await query("create index if not exists idx_friendships_friend_id on friendships(friend_id)");
  await query("create index if not exists idx_friendships_status on friendships(status)");
  await query("create index if not exists idx_direct_messages_sender_id on direct_messages(sender_id)");
  await query("create index if not exists idx_direct_messages_receiver_id on direct_messages(receiver_id)");
  await query("create index if not exists idx_direct_messages_created_at on direct_messages(created_at)");

  // ============ PAYOS PAYMENT ORDERS TABLE ============
  await query(`
    CREATE TABLE IF NOT EXISTS payment_orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_code BIGINT UNIQUE NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_id VARCHAR(100) NOT NULL,
      plan_name VARCHAR(255) NOT NULL,
      amount INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      payment_method VARCHAR(50),
      payos_transaction_id VARCHAR(255),
      checkout_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      paid_at TIMESTAMPTZ,
      cancelled_at TIMESTAMPTZ,
      metadata JSONB
    )
  `);
  await query("CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id)");
  await query("CREATE INDEX IF NOT EXISTS idx_payment_orders_order_code ON payment_orders(order_code)");
  await query("CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status)");
  await query("CREATE INDEX IF NOT EXISTS idx_payment_orders_created_at ON payment_orders(created_at)");

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
  await query("create unique index if not exists idx_users_facebook_id on users(facebook_id) where facebook_id is not null");
  await query("create unique index if not exists idx_users_phone on users(phone) where phone is not null");
  await query("create index if not exists idx_users_otp_verified on users(otp_verified)");
  await query("create index if not exists idx_user_profiles_user_id on user_profiles(user_id)");

  // Seed/Migrate default admin account if configured in env
  const adminEmail = process.env.ADMIN_EMAIL || "admin@jobreadyai.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    // 1. Tự động chuyển đổi tài khoản admin cũ từ phone sang email (nếu có)
    const oldAdminCheck = await query("select id, phone from users where role = 'admin' and phone is not null and email is null");
    if (oldAdminCheck.rows.length > 0) {
      console.log(`Migrating old admin account with phone ${oldAdminCheck.rows[0].phone} to email: ${adminEmail}`);
      await query(
        `update users set email = $1, phone = null, auth_provider = 'email', otp_verified = true, status = 'active' where role = 'admin'`,
        [adminEmail]
      );
    }

    // 2. Kiểm tra tài khoản admin theo email hiện tại
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
        title: "10 Tiêu Chí Quan Trọng Khi Chọn CV Cho Nhà Tuyển Dụng",
        content: `Khi nhận được hàng trăm hồ sơ ứng tuyển, nhà tuyển dụng thường chỉ dành 6-10 giây để lướt qua mỗi CV. Dưới đây là 10 tiêu chí quan trọng giúp bạn hiểu điều gì khiến CV của bạn nổi bật:

1. Thông Tin Cá Nhân Rõ Ràng
Đảm bảo tên đầy đủ, số điện thoại, email liên lạc được đặt ở vị trí dễ thấy. Tránh thông tin thừa như số CMND, tình trạng hôn nhân.

2. Tóm Tắt Chuyên Môn (Profile Summary)
Một đoạn tóm tắt 2-3 câu về bản thân, highlight kỹ năng chính và mục tiêu nghề nghiệp.

3. Kinh Nghiệm Làm Việc Được Trình Bày Tốt
Sử dụng cấu trúc: Chức danh - Tên công ty - Thời gian - Mô tả công việc (với bullet points). Nhấn mạnh thành tích cụ thể bằng số liệu.

4. Kỹ Năng Phù Hợp Với Vị Trí
Liệt kê kỹ năng hard skills (kỹ thuật) và soft skills (mềm) phù hợp với job description.

5. Học Vấn và Chứng Chỉ
Tập trung vào chứng chỉ chuyên môn, khóa học liên quan.

6. Định Dạng Chuyên Nghiệp
Font dễ đọc (Arial, Calibri), cỡ chữ 10-12pt, lề đều. PDF là định dạng an toàn nhất để giữ format.

7. Không Có Lỗi Chính Tả
Đọc đi đọc lại nhiều lần. Sử dụng công cụ kiểm tra chính tả.

8. Độ Dài Phù Hợp
1-2 trang cho ứng viên có dưới 10 năm kinh nghiệm.

9. Từ Khóa Theo JD
Nhiều công ty sử dụng ATS (Applicant Tracking System) để lọc CV.

10. Liên Kết Portfolio/Dự Án
Nếu bạn có portfolio online, đưa link vào CV.`,
        excerpt: "Khám phá 10 tiêu chí quan trọng giúp CV của bạn gây ấn tượng với nhà tuyển dụng.",
        category: "Tiêu chí chọn CV",
      },
      {
        title: "Cách Viết Mục Tiêu Nghề Nghiệp Thu Hút Nhà Tuyển Dụng",
        content: `Mục tiêu nghề nghiệp là phần ngắn gọn nhưng cực kỳ quan trọng trên CV. Nó định vị bạn là ai và what you want.

Cấu Trúc Một Mục Tiêu Hiệu Quả:
1. Vị trí mong muốn + Lĩnh vực
2. Kỹ năng chính mang lại
3. Giá trị bạn có thể đóng góp

Ví Dụ Tốt:
"Kế toán tổng hợp với 3 năm kinh nghiệm trong lĩnh vực sản xuất. Thành thạo Excel nâng cao, phần mềm kế toán SAP. Tìm kiếm vị trí Kế toán trưởng để áp dụng kỹ năng quản lý tài chính."

Lưu Ý Quan Trọng:
- Điều chỉnh theo từng đơn ứng tuyển
- Không quá 3-4 dòng
- Sử dụng từ khóa từ job description
- Đặt ở vị trí đầu CV, sau thông tin cá nhân`,
        excerpt: "Hướng dẫn chi tiết cách viết mục tiêu nghề nghiệp ấn tượng, phù hợp với từng vị trí.",
        category: "Tiêu chí xin việc",
      },
      {
        title: "7 Câu Hỏi Phỏng Vấn Thường Gặp Và Cách Trả Lời Hay",
        content: `Phỏng vấn là cơ hội để bạn thể hiện không chỉ năng lực mà còn cá tính và văn hóa phù hợp.

1. "Hãy giới thiệu về bản thân"
Không lặp lại toàn bộ CV. Tập trung vào 2-3 điểm mạnh liên quan trực tiếp đến vị trí ứng tuyển.

2. "Điểm mạnh và điểm yếu của bạn là gì?"
Điểm mạnh: Chọn 2-3 điểm phù hợp với job description, kèm ví dụ cụ thể.
Điểm yếu: Chọn điểm yếu thật nhưng không quá nghiêm trọng, và bạn đang cải thiện nó.

3. "Tại sao bạn muốn làm việc tại công ty chúng tôi?"
Nghiên cứu kỹ về công ty trước. Kết nối giá trị của bạn với mission/culture của công ty.

4. "Bạn thấy mình 5 năm tới ở đâu?"
Thể hiện ambition phù hợp. Kết hợp giữa mục tiêu cá nhân và đóng góp cho công ty.

5. "Mô tả một thử thách và cách bạn vượt qua nó"
Chọn một ví dụ liên quan đến công việc. Sử dụng STAR method: Situation, Task, Action, Result.

6. "Bạn có câu hỏi gì cho chúng tôi?"
LUÔN LUÔN có câu hỏi! Hỏi về đội nhóm, văn hóa công ty, cơ hội phát triển.

7. "Kể về một dự án thành công của bạn"
Chọn dự án thể hiện kỹ năng cần thiết cho vị trí.`,
        excerpt: "Tổng hợp 7 câu hỏi phỏng vấn phổ biến nhất kèm cách trả lời chuyên nghiệp.",
        category: "Mẹo phỏng vấn",
      },
      {
        title: "Xu Hướng Tuyển Dụng 2024-2025 Tại Việt Nam",
        content: `Thị trường lao động Việt Nam đang thay đổi nhanh chóng. Nắm bắt xu hướng giúp bạn chuẩn bị tốt hơn:

1. Hybrid Work - Làm Việc Kết Hợp
Nhiều công ty áp dụng mô hình hybrid. 60% doanh nghiệp CNTT cho phép làm việc từ xa 2-3 ngày/tuần.

2. Kỹ Năng Số Hóa Là Bắt Buộc
Kỹ năng số cơ bản như Excel nâng cao, công cụ collaboration đang trở thành yêu cầu tối thiểu.

3. AI Skills - Kỹ Năng AI
Hiểu cách sử dụng AI tools để tăng năng suất là lợi thế lớn.

4. Soft Skills Được Đề Cao
Kỹ năng mềm như giao tiếp, giải quyết vấn đề khó đào tạo hơn hard skills.

5. Upskilling và Reskilling
Học tập liên tục không còn là lựa chọn. Các khóa học online đang rất phổ biến.

6. Tech Roles Vẫn Dẫn Đầu
Software Engineer, Data Analyst, Cloud Engineer là những vị trí có nhu cầu cao nhất.`,
        excerpt: "Phân tích chi tiết các xu hướng tuyển dụng nổi bật tại Việt Nam 2024-2025.",
        category: "Xu hướng tuyển dụng",
      },
      {
        title: "Cách Trả Lời Câu Hỏi Về Mức Lương Mong Muốn",
        content: `Câu hỏi về mức lương thường khiến ứng viên lúng túng. Dưới đây là chiến lược trả lời thông minh:

Nguyên Tắc Vàng:
1. KHÔNG đưa ra con số đầu tiên nếu có thể
2. Nghiên cứu mức lương thị trường trước
3. Thể hiện sự linh hoạt nhưng biết giá trị của mình

Chiến Lược 1: Phản lại câu hỏi
"Anh/Chị có thể cho biết mức lương cho vị trí này là bao nhiêu ạ?"

Chiến Lược 2: Đưa ra range (có cơ sở)
"Dựa trên research, mức lương phù hợp cho vị trí này là 20-25 triệu."

Chiến Lược 3: Nói về giá trị
"Tôi tin rằng mức lương sẽ phản ánh giá trị tôi mang lại."

Khi Đã Phải Nói Số:
- Research trên Glassdoor, Vietnamwork, CareerViet
- Biết minimum acceptable salary của bạn
- Luôn để buffer 10-15% để thương lượng`,
        excerpt: "Hướng dẫn chi tiết cách trả lời về mức lương mong muốn một cách chuyên nghiệp.",
        category: "Tiêu chí xin việc",
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
        "Tiêu chí chọn CV": "cv_tips",
        "Mẹo phỏng vấn": "interview_tips",
        "Kỹ năng nghề nghiệp": "soft_skills",
        "Tiêu chí xin việc": "career",
        "Xu hướng tuyển dụng": "other"
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
      console.log("Đồng bộ hóa blog_posts sang articles thành công.");
    }
  } catch (syncError) {
    console.error("Lỗi đồng bộ hóa blog_posts sang articles:", syncError);
  }
}


