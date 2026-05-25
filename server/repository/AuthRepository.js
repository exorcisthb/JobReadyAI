import { query, withTransaction } from "../config/database.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class AuthRepository {
  /**
   * Tạo hoặc cập nhật OTP request (lưu vào bảng otp_requests, KHÔNG tạo tài khoản)
   * Tài khoản chỉ được tạo sau khi OTP xác thực thành công và người dùng đặt mật khẩu.
   */
  static async createOTPRequest(email) {
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP hết hạn sau 10 phút

    await query(
      `
        insert into otp_requests (email, otp, otp_expiry, verified, updated_at)
        values ($1, $2, $3, false, now())
        on conflict (email) do update set
          otp = excluded.otp,
          otp_expiry = excluded.otp_expiry,
          verified = false,
          updated_at = now()
      `,
      [email, otp, otpExpiry],
    );

    return { email, otp };
  }

  /**
   * Xác minh OTP từ bảng otp_requests
   */
  static async verifyOTP(email, otp) {
    const result = await query(
      `
        select email, otp, otp_expiry, verified
        from otp_requests
        where email = $1
      `,
      [email],
    );

    if (!result.rows[0]) {
      return { verified: false, error: "Email không tồn tại hoặc chưa yêu cầu OTP." };
    }

    const req = result.rows[0];

    if (req.verified) {
      return { verified: false, error: "OTP đã được xác thực rồi, vui lòng tiếp tục đặt mật khẩu." };
    }

    if (new Date() > req.otp_expiry) {
      return { verified: false, error: "Mã OTP đã hết hạn, vui lòng đăng ký lại." };
    }

    if (req.otp !== otp) {
      return { verified: false, error: "Mã OTP không chính xác." };
    }

    await query(
      `update otp_requests set verified = true, updated_at = now() where email = $1`,
      [email],
    );

    return { verified: true };
  }

  /**
   * Tạo tài khoản thực sự sau khi OTP đã được xác thực và người dùng nhập mật khẩu.
   * Xóa otp_request sau khi tạo tài khoản thành công.
   */
  static async createUserAfterVerification(email, passwordHash) {
    // Kiểm tra OTP request đã được verified chưa
    const otpResult = await query(
      `select email, verified from otp_requests where email = $1`,
      [email],
    );

    if (!otpResult.rows[0]) {
      return { created: false, error: "Không tìm thấy yêu cầu đăng ký. Vui lòng bắt đầu lại." };
    }

    if (!otpResult.rows[0].verified) {
      return { created: false, error: "Email chưa được xác thực OTP." };
    }

    return withTransaction(async (client) => {
      // Tạo user trong bảng users
      const userResult = await client.query(
        `
          insert into users (email, password_hash, auth_provider, otp_verified, status)
          values ($1, $2, 'email', true, 'active')
          returning id, email, otp_verified, role
        `,
        [email, passwordHash],
      );
      const newUser = userResult.rows[0];

      // Tạo profile trống
      await client.query(
        `
          insert into user_profiles (user_id, full_name, profile_completed)
          values ($1, '', false)
        `,
        [newUser.id],
      );

      // Xóa OTP request sau khi tạo xong
      await client.query(`delete from otp_requests where email = $1`, [email]);

      return { created: true, user: newUser };
    });
  }

  static async findActiveUserByEmail(email) {
    const result = await query(
      `
        select users.id, users.email, users.google_id, users.phone, users.password_hash, users.otp_verified, users.role,
          user_profiles.full_name, user_profiles.avatar_url, user_profiles.phone as profile_phone,
          user_profiles.job_title, user_profiles.industry, user_profiles.experience_level,
          user_profiles.location, user_profiles.skills, user_profiles.career_goal,
          user_profiles.profile_completed
        from users
        left join user_profiles on user_profiles.user_id = users.id
        where users.email = $1 and users.auth_provider = 'email' and users.status = 'active' and users.otp_verified = true
      `,
      [email],
    );

    return result.rows[0];
  }

  static async updatePasswordByVerifiedEmail(email, passwordHash) {
    return withTransaction(async (client) => {
      const otpResult = await client.query(
        `select verified from otp_requests where email = $1`,
        [email],
      );

      if (!otpResult.rows[0]?.verified) {
        return { updated: false, reason: "OTP_REQUIRED" };
      }

      const result = await client.query(
        `
          update users
          set password_hash = $1, updated_at = now()
          where email = $2 and auth_provider = 'email' and status = 'active' and otp_verified = true
        `,
        [passwordHash, email],
      );

      if (result.rowCount > 0) {
        await client.query(`delete from otp_requests where email = $1`, [email]);
      }

      return {
        updated: result.rowCount > 0,
        reason: result.rowCount > 0 ? null : "NOT_FOUND",
      };
    });
  }

  static async existsByEmailProvider(email, provider) {
    const result = await query(
      "select 1 from users where email = $1 and auth_provider = $2",
      [email, provider]
    );
    return result.rowCount > 0;
  }

  static async upsertGoogleUser(oAuthDTO) {
    return withTransaction(async (client) => {
      const userResult = await client.query(
        `
          insert into users (email, google_id, auth_provider, otp_verified)
          values ($1, $2, 'google', true)
          on conflict (email, auth_provider) do update set
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

  static async existsByEmail(email) {
    const result = await query("select 1 from users where email = $1 and auth_provider = 'email'", [email]);
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
