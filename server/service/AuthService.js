import bcrypt from "bcryptjs";
import { AuthRepository } from "../repository/AuthRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { serializeUser } from "../utils/authUtils.js";
import { sendOtpEmail } from "./EmailService.js";

export class AuthService {
  static async register(registerDTO) {
    registerDTO.validate();

    // Kiểm tra email đã tồn tại trong bảng users chưa
    const emailExists = await AuthRepository.existsByEmailProvider(registerDTO.email, "email");
    if (emailExists) {
      throw new ApiError(409, "Email này đã được đăng ký.");
    }

    // Chỉ tạo OTP request, KHÔNG tạo tài khoản
    const result = await AuthRepository.createOTPRequest(registerDTO.email);
    await sendOtpEmail(result.email, result.otp);
    return { email: result.email, message: "OTP đã được gửi, vui lòng kiểm tra email của bạn." };
  }

  static async verifyOTP(verifyOTPDTO) {
    verifyOTPDTO.validate();

    const result = await AuthRepository.verifyOTP(verifyOTPDTO.email, verifyOTPDTO.otp);

    if (!result.verified) {
      throw new ApiError(400, result.error);
    }

    return { email: verifyOTPDTO.email, verified: true };
  }

  static async login(loginDTO, ipAddress = null) {
    console.log("[AuthService.login] Starting login process for email:", loginDTO.email);
    loginDTO.validate();

    // Bước 1: Kiểm tra email có trong danh sách tài khoản test đã bị xóa không
    console.log("[AuthService.login] Checking deleted test users...");
    try {
      const isDeletedTestUser = await AuthRepository.isDeletedTestUserEmail(loginDTO.email);
      if (isDeletedTestUser) {
        console.log("[AuthService.login] User is deleted test user");
        throw new ApiError(401, "Tài khoản User test này đã bị xóa.");
      }
    } catch (error) {
      // If deleted_test_users table doesn't exist or query fails, skip this check
      // Don't block login for this reason
      if (error instanceof ApiError) throw error; // Re-throw ApiError (user is deleted)
      console.warn("[AuthService.login] Could not check deleted_test_users table:", error.message);
    }

    // Bước 2: Tìm user theo email trong hệ thống
    console.log("[AuthService.login] Finding user by email...");
    const user = await AuthRepository.findActiveUserByEmail(loginDTO.email);
    console.log("[AuthService.login] User found:", user ? "Yes" : "No");

    if (!user) {
      // Email không tồn tại trong hệ thống => User thường chưa đăng ký
      console.log("[AuthService.login] User not found");
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    if (user.status === "locked") {
      console.log("[AuthService.login] User is locked");
      throw new ApiError(403, "Tài khoản đã bị khóa, vui lòng liên hệ admin.");
    }

    // Bước 3: Kiểm tra mật khẩu — phân biệt thông báo test user vs user thường
    console.log("[AuthService.login] Comparing passwords...");
    if (!user.password_hash || !(await bcrypt.compare(loginDTO.password, user.password_hash))) {
      console.log("[AuthService.login] Password mismatch");
      if (user.is_test_user) {
        throw new ApiError(401, "Email hoặc mật khẩu User test không đúng.");
      }
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    console.log("[AuthService.login] Recording login...");
    await AuthRepository.recordLogin(user.id, ipAddress);

    console.log("[AuthService.login] Serializing user...");
    const serializedUser = serializeUser(user);
    console.log("[AuthService.login] Login successful");
    return serializedUser;
  }

  static async completeRegistration(completeRegistrationDTO, ipAddress = null) {
    completeRegistrationDTO.validate();

    const passwordHash = await bcrypt.hash(completeRegistrationDTO.password, 12);

    // Tạo tài khoản thật sự trong DB (chỉ khi OTP đã verified)
    const result = await AuthRepository.createUserAfterVerification(
      completeRegistrationDTO.email,
      passwordHash,
      ipAddress,
    );

    if (!result.created) {
      throw new ApiError(400, result.error);
    }

    const user = await AuthRepository.findActiveUserByEmail(completeRegistrationDTO.email);
    return serializeUser(user);
  }

  static async loginWithOAuth(oAuthDTO, ipAddress = null) {
    oAuthDTO.validate();

    const user = oAuthDTO.provider === "facebook"
      ? await AuthRepository.upsertFacebookUser(oAuthDTO, ipAddress)
      : await AuthRepository.upsertGoogleUser(oAuthDTO, ipAddress);

    if (user.status === "locked") {
      throw new ApiError(403, "Tài khoản đã bị khóa, vui lòng liên hệ admin.");
    }

    await AuthRepository.recordLogin(user.id, ipAddress);

    return serializeUser(user);
  }

  static async syncClerkUser(body, ipAddress = null) {
    const { clerkId, email, name, image } = body || {};
    if (!clerkId) {
      throw new ApiError(400, "Thiếu clerkId");
    }

    const user = await AuthRepository.syncClerkUser({ clerkId, email, name, image }, ipAddress);
    if (user.status === "locked") {
      throw new ApiError(403, "Tài khoản đã bị khóa, vui lòng liên hệ admin.");
    }

    return serializeUser(user);
  }

  static async loginWithFacebook(body, ipAddress = null) {
    const token = body.accessToken || body.access_token;

    let oAuthDTO;

    if (token) {
      try {
        console.log("[AuthService.loginWithFacebook] Verifying token with Graph API...");
        const res = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("[AuthService.loginWithFacebook] Facebook Graph API error:", errData);
          throw new ApiError(401, "Facebook Access Token không hợp lệ hoặc đã hết hạn.");
        }
        const fbUser = await res.json();
        console.log("[AuthService.loginWithFacebook] Graph API user verified:", fbUser.id);
        oAuthDTO = new OAuthDTO({
          provider: "facebook",
          facebookId: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          image: fbUser.picture?.data?.url,
        });
      } catch (err) {
        if (err instanceof ApiError) throw err;
        console.warn("[AuthService.loginWithFacebook] Graph API fetch failed, falling back to body params:", err.message);
        oAuthDTO = new OAuthDTO({ ...body, provider: "facebook" });
      }
    } else {
      oAuthDTO = new OAuthDTO({ ...body, provider: "facebook" });
    }

    return this.loginWithOAuth(oAuthDTO, ipAddress);
  }

  static async checkEmail(checkEmailDTO) {
    return AuthRepository.existsByEmail(checkEmailDTO.email);
  }

  static async requestPasswordReset(checkEmailDTO) {
    const emailExists = await AuthRepository.existsByEmail(checkEmailDTO.email);

    if (!emailExists) {
      throw new ApiError(404, "Email không tồn tại trong hệ thống.");
    }

    const result = await AuthRepository.createOTPRequest(checkEmailDTO.email);
    await sendOtpEmail(result.email, result.otp);

    return {
      email: result.email,
      message: "OTP đã được gửi, vui lòng kiểm tra email của bạn.",
    };
  }

  static async resetPassword(resetPasswordDTO) {
    resetPasswordDTO.validate();

    const passwordHash = await bcrypt.hash(resetPasswordDTO.password, 12);
    const result = await AuthRepository.updatePasswordByVerifiedEmail(
      resetPasswordDTO.email,
      passwordHash,
    );

    if (!result.updated && result.reason === "OTP_REQUIRED") {
      throw new ApiError(400, "Vui lòng xác minh OTP trước khi đổi mật khẩu.");
    }

    if (!result.updated) {
      throw new ApiError(404, "Email không tồn tại trong hệ thống.");
    }

    return true;
  }

  static async completeProfile(profileDTO) {
    profileDTO.validate();

    const profile = await AuthRepository.completeProfile(profileDTO);

    if (!profile) {
      throw new ApiError(404, "Không tìm thấy profile người dùng.");
    }

    return profile;
  }
}
