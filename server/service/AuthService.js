import bcrypt from "bcryptjs";
import { AuthRepository } from "../repository/AuthRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { serializeUser } from "../utils/authUtils.js";
import { sendOtpEmail } from "./EmailService.js";

export class AuthService {
  static async register(registerDTO) {
    registerDTO.validate();

    // Kiá»ƒm tra email Ä‘Ã£ tá»“n táº¡i trong báº£ng users chÆ°a
    const emailExists = await AuthRepository.existsByEmailProvider(registerDTO.email, "email");
    if (emailExists) {
      throw new ApiError(409, "Email nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½.");
    }

    // Chá»‰ táº¡o OTP request, KHÃ”NG táº¡o tÃ i khoáº£n
    const result = await AuthRepository.createOTPRequest(registerDTO.email);
    await sendOtpEmail(result.email, result.otp);
    return { email: result.email, message: "OTP Ä‘Ã£ Ä‘Æ°á»£c gá»­i, vui lÃ²ng kiá»ƒm tra email cá»§a báº¡n." };
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

    const user = await AuthRepository.findActiveUserByEmail(loginDTO.email);

    if (!user) {
      throw new ApiError(401, "Email hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng.");
    }

    if (user.status === "locked") {
      throw new ApiError(403, "TÃ i khoáº£n Ä‘Ã£ bá»‹ khÃ³a, vui lÃ²ng liÃªn há»‡ admin.");
    }

    if (!user.password_hash || !(await bcrypt.compare(loginDTO.password, user.password_hash))) {
      throw new ApiError(401, "Email hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng.");
    }

    await AuthRepository.recordLogin(user.id, ipAddress);

    return serializeUser(user);
  }

  static async completeRegistration(completeRegistrationDTO, ipAddress = null) {
    completeRegistrationDTO.validate();

    const passwordHash = await bcrypt.hash(completeRegistrationDTO.password, 12);

    // Táº¡o tÃ i khoáº£n tháº­t sá»± trong DB (chá»‰ khi OTP Ä‘Ã£ verified)
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
      throw new ApiError(403, "TÃ i khoáº£n Ä‘Ã£ bá»‹ khÃ³a, vui lÃ²ng liÃªn há»‡ admin.");
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
      throw new ApiError(404, "Email khÃ´ng tá»“n táº¡i trong há»‡ thá»‘ng.");
    }

    const result = await AuthRepository.createOTPRequest(checkEmailDTO.email);
    await sendOtpEmail(result.email, result.otp);

    return {
      email: result.email,
      message: "OTP Ä‘Ã£ Ä‘Æ°á»£c gá»­i, vui lÃ²ng kiá»ƒm tra email cá»§a báº¡n.",
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
      throw new ApiError(400, "Vui lÃ²ng xÃ¡c minh OTP trÆ°á»›c khi Ä‘á»•i máº­t kháº©u.");
    }

    if (!result.updated) {
      throw new ApiError(404, "Email khÃ´ng tá»“n táº¡i trong há»‡ thá»‘ng.");
    }

    return true;
  }

  static async completeProfile(profileDTO) {
    profileDTO.validate();

    const profile = await AuthRepository.completeProfile(profileDTO);

    if (!profile) {
      throw new ApiError(404, "KhÃ´ng tÃ¬m tháº¥y profile ngÆ°á»i dÃ¹ng.");
    }

    return profile;
  }
}

