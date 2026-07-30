import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { CheckEmailController } from "../controller/CheckEmailController.js";
import { CompleteProfileController } from "../controller/CompleteProfileController.js";
import { CompleteRegistrationController } from "../controller/CompleteRegistrationController.js";
import { LoginController } from "../controller/LoginController.js";
import { LogoutController } from "../controller/LogoutController.js";
import { OAuthController } from "../controller/OAuthController.js";
import { RegisterController } from "../controller/RegisterController.js";
import { RequestPasswordResetController } from "../controller/RequestPasswordResetController.js";
import { ResetPasswordController } from "../controller/ResetPasswordController.js";
import { VerifyOTPController } from "../controller/VerifyOTPController.js";
import { UpdateProfileController } from "../controller/UpdateProfileController.js";
import { ChangePasswordController } from "../controller/ChangePasswordController.js";
import { AvatarController, uploadAvatar } from "../controller/AvatarController.js";
import { UpdateLanguageController } from "../controller/UpdateLanguageController.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED", message: "Quá nhiều yêu cầu xác thực, vui lòng thử lại sau." },
});

const sensitiveAuth = [authLimiter];

// Reset auth rate limiter counter sau khi login thành công
function resetAuthLimiterOnSuccess(req, res, next) {
  res.on("finish", () => {
    if (res.statusCode === 200 && req.rateLimit?.key) {
      authLimiter.resetKey(req.rateLimit.key);
    }
  });
  next();
}

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip || "unknown"),
  message: { error: "RATE_LIMITED", message: "Quá nhiều yêu cầu tải lên, vui lòng thử lại sau." },
});

export const authRoutes = Router();

authRoutes.post("/register", ...sensitiveAuth, RegisterController.register);
authRoutes.post("/verify-otp", ...sensitiveAuth, VerifyOTPController.verify);
authRoutes.post("/complete-registration", ...sensitiveAuth, CompleteRegistrationController.complete);
authRoutes.post("/login", ...sensitiveAuth, resetAuthLimiterOnSuccess, LoginController.login);
authRoutes.post("/oauth", ...sensitiveAuth, OAuthController.login);
authRoutes.post("/facebook", ...sensitiveAuth, OAuthController.facebookLogin);
authRoutes.post("/check-email", ...sensitiveAuth, CheckEmailController.check);
authRoutes.post("/request-password-reset", ...sensitiveAuth, RequestPasswordResetController.request);
authRoutes.post("/reset-password", ...sensitiveAuth, ResetPasswordController.reset);
authRoutes.post("/complete-profile", ...sensitiveAuth, CompleteProfileController.complete);
authRoutes.post("/logout", LogoutController.logout);
authRoutes.put("/profile", UpdateProfileController.update);
authRoutes.put("/change-password", ChangePasswordController.change);
authRoutes.post("/change-password/send-otp", ChangePasswordController.sendOTP);
authRoutes.post("/change-password/verify-otp", ChangePasswordController.verifyOTP);
authRoutes.post("/avatar", uploadLimiter, uploadAvatar, AvatarController.upload);
authRoutes.put("/language", UpdateLanguageController.update);
authRoutes.get("/language", UpdateLanguageController.get);
