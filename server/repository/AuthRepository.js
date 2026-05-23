import { query, withTransaction } from "../config/database.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class AuthRepository {
  static async createPhoneUser(registerDTO) {
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP hết hạn sau 10 phút

    return withTransaction(async (client) => {
      const userResult = await client.query(
        `
          insert into users (phone, otp, otp_expiry, otp_verified)
          values ($1, $2, $3, false)
          returning id, phone, otp_verified
        `,
        [registerDTO.phone, otp, otpExpiry],
      );
      const createdUser = userResult.rows[0];

      await client.query(
        `
          insert into user_profiles (user_id, full_name, profile_completed)
          values ($1, $2, false)
          on conflict (user_id) do update set
            full_name = excluded.full_name,
            profile_completed = false,
            updated_at = now()
        `,
        [createdUser.id, ""],
      );

      return { ...createdUser, otp }; // Return OTP để gửi cho user (trong production, gửi SMS)
    });
  }

  static async verifyOTP(phone, otp) {
    const result = await query(
      `
        select id, otp, otp_expiry, otp_verified
        from users
        where phone = $1
        order by created_at desc
        limit 1
      `,
      [phone],
    );

    if (!result.rows[0]) {
      return { verified: false, error: "Số điện thoại không tồn tại." };
    }

    const user = result.rows[0];

    if (user.otp_verified) {
      return { verified: false, error: "Tài khoản đã được xác thực." };
    }

    if (new Date() > user.otp_expiry) {
      return { verified: false, error: "Mã OTP đã hết hạn, vui lòng đăng ký lại." };
    }

    if (user.otp !== otp) {
      return { verified: false, error: "Mã OTP không chính xác." };
    }

    const updateResult = await query(
      `
        update users
        set otp_verified = true, updated_at = now()
        where id = $1
        returning id, phone, otp_verified
      `,
      [user.id],
    );

    return { verified: true, user: updateResult.rows[0] };
  }

  static async findActiveUserByPhone(phone) {
    const result = await query(
      `
        select users.id, users.email, users.google_id, users.phone, users.password_hash, users.otp_verified, users.role,
          user_profiles.full_name, user_profiles.avatar_url, user_profiles.phone as profile_phone,
          user_profiles.job_title, user_profiles.industry, user_profiles.experience_level,
          user_profiles.location, user_profiles.skills, user_profiles.career_goal,
          user_profiles.profile_completed
        from users
        left join user_profiles on user_profiles.user_id = users.id
        where users.phone = $1 and users.status = 'active' and users.otp_verified = true
      `,
      [phone],
    );

    return result.rows[0];
  }

  static async updatePasswordByVerifiedPhone(phone, passwordHash) {
    const result = await query(
      `
        update users
        set password_hash = $1, updated_at = now()
        where phone = $2 and status = 'active' and otp_verified = true
      `,
      [passwordHash, phone],
    );

    return result.rowCount;
  }

  static async existsByPhone(phone) {
    const result = await query("select 1 from users where phone = $1", [phone]);
    return result.rowCount > 0;
  }

  static async upsertGoogleUser(oAuthDTO) {
    return withTransaction(async (client) => {
      const userResult = await client.query(
        `
          insert into users (email, google_id, otp_verified)
          values ($1, $2, true)
          on conflict (email) do update set
            google_id = coalesce(users.google_id, excluded.google_id),
            updated_at = now()
          returning id, email, google_id
        `,
        [oAuthDTO.email, oAuthDTO.googleId],
      );
      const upsertedUser = userResult.rows[0];

      const profileResult = await client.query(
        `
          insert into user_profiles (user_id, full_name, avatar_url, profile_completed)
          values ($1, $2, $3, false)
          on conflict (user_id) do update set
            full_name = case
              when user_profiles.profile_completed then user_profiles.full_name
              else excluded.full_name
            end,
            avatar_url = coalesce(excluded.avatar_url, user_profiles.avatar_url),
            updated_at = now()
          returning full_name, avatar_url, phone, job_title, industry, experience_level,
            location, skills, career_goal, profile_completed
        `,
        [upsertedUser.id, oAuthDTO.name, oAuthDTO.image],
      );
      const profile = profileResult.rows[0];

      return { ...upsertedUser, ...profile };
    });
  }

  static async findActiveUserByEmail(email) {
    const result = await query(
      `
        select users.id, users.email, users.google_id, users.phone, users.role,
          user_profiles.full_name, user_profiles.avatar_url, user_profiles.phone as profile_phone,
          user_profiles.job_title, user_profiles.industry, user_profiles.experience_level,
          user_profiles.location, user_profiles.skills, user_profiles.career_goal,
          user_profiles.profile_completed
        from users
        left join user_profiles on user_profiles.user_id = users.id
        where users.email = $1 and users.status = 'active'
      `,
      [email],
    );

    return result.rows[0];
  }

  static async updatePasswordByEmail(email, passwordHash) {
    const result = await query(
      "update users set password_hash = $1, updated_at = now() where email = $2",
      [passwordHash, email],
    );

    return result.rowCount;
  }

  static async existsByEmail(email) {
    const result = await query("select 1 from users where email = $1", [email]);
    return result.rowCount > 0;
  }

  static async completeProfile(profileDTO) {
    const result = await query(
      `
        update user_profiles
        set full_name = $1, phone = $2, job_title = $3, industry = $4, experience_level = $5,
            location = $6, skills = $7, career_goal = $8, profile_completed = true,
            updated_at = now()
        where user_id = $9
        returning *
      `,
      [
        profileDTO.fullName,
        profileDTO.phone,
        profileDTO.jobTitle,
        profileDTO.industry,
        profileDTO.experienceLevel,
        profileDTO.location,
        profileDTO.skills,
        profileDTO.careerGoal,
        profileDTO.userId,
      ],
    );

    return result.rows[0];
  }
}
