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
    loginDTO.validate();

    // Bước 1: Kiểm tra email có trong danh sách tài khoản test đã bị xóa không
    const isDeletedTestUser = await AuthRepository.isDeletedTestUserEmail(loginDTO.email);
    if (isDeletedTestUser) {
      throw new ApiError(401, "Tài khoản User test này đã bị xóa.");
    }

    // Bước 2: Tìm user theo email trong hệ thống
    const user = await AuthRepository.findActiveUserByEmail(loginDTO.email);

    if (!user) {
      // Email không tồn tại trong hệ thống => User thường chưa đăng ký
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    if (user.status === "locked") {
      throw new ApiError(403, "Tài khoản đã bị khóa, vui lòng liên hệ admin.");
    }

    // Bước 3: Kiểm tra mật khẩu — phân biệt thông báo test user vs user thường
    if (!user.password_hash || !(await bcrypt.compare(loginDTO.password, user.password_hash))) {
      if (user.is_test_user) {
        throw new ApiError(401, "Email hoặc mật khẩu User test không đúng.");
      }
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    await AuthRepository.recordLogin(user.id, ipAddress);

    return serializeUser(user);
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

    const user = await AuthRepository.upsertGoogleUser(oAuthDTO, ipAddress);

    if (user.status === "locked") {
      throw new ApiError(403, "Tài khoản đã bị khóa, vui lòng liên hệ admin.");
    }

    await AuthRepository.recordLogin(user.id, ipAddress);

    return serializeUser(user);
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
