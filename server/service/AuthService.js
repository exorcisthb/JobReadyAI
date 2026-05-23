import bcrypt from "bcryptjs";
import { AuthRepository } from "../repository/AuthRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { serializeUser } from "../utils/authUtils.js";

export class AuthService {
  static async register(registerDTO) {
    registerDTO.validate();

    const phoneExists = await AuthRepository.existsByPhone(registerDTO.phone);
    if (phoneExists) {
      throw new ApiError(409, "Số điện thoại này đã được đăng ký.");
    }

    const result = await AuthRepository.createPhoneUser(registerDTO);
    return { phone: result.phone, otp: result.otp, message: "OTP đã được gửi, vui lòng kiểm tra." };
  }

  static async verifyOTP(verifyOTPDTO) {
    verifyOTPDTO.validate();

    const result = await AuthRepository.verifyOTP(verifyOTPDTO.phone, verifyOTPDTO.otp);

    if (!result.verified) {
      throw new ApiError(400, result.error);
    }

    return { phone: verifyOTPDTO.phone, verified: true };
  }

  static async login(loginDTO) {
    loginDTO.validate();

    const user = await AuthRepository.findActiveUserByPhone(loginDTO.phone);

    if (!user?.password_hash || !(await bcrypt.compare(loginDTO.password, user.password_hash))) {
      throw new ApiError(401, "Số điện thoại hoặc mật khẩu không đúng.");
    }

    return serializeUser(user);
  }

  static async completeRegistration(completeRegistrationDTO) {
    completeRegistrationDTO.validate();

    const passwordHash = await bcrypt.hash(completeRegistrationDTO.password, 12);
    const rowCount = await AuthRepository.updatePasswordByVerifiedPhone(
      completeRegistrationDTO.phone,
      passwordHash,
    );

    if (rowCount === 0) {
      throw new ApiError(400, "Số điện thoại chưa được xác thực OTP.");
    }

    const user = await AuthRepository.findActiveUserByPhone(completeRegistrationDTO.phone);
    return serializeUser(user);
  }

  static async loginWithOAuth(oAuthDTO) {
    oAuthDTO.validate();

    const user = await AuthRepository.upsertGoogleUser(oAuthDTO);
    return serializeUser(user);
  }

  static async checkEmail(checkEmailDTO) {
    return AuthRepository.existsByEmail(checkEmailDTO.email);
  }

  static async resetPassword(resetPasswordDTO) {
    resetPasswordDTO.validate();

    const passwordHash = await bcrypt.hash(resetPasswordDTO.password, 12);
    const rowCount = await AuthRepository.updatePasswordByEmail(
      resetPasswordDTO.email,
      passwordHash,
    );

    if (rowCount === 0) {
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
