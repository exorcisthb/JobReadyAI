import { Router } from "express";
import { CheckEmailController } from "../controller/CheckEmailController.js";
import { CompleteProfileController } from "../controller/CompleteProfileController.js";
import { CompleteRegistrationController } from "../controller/CompleteRegistrationController.js";
import { LoginController } from "../controller/LoginController.js";
import { OAuthController } from "../controller/OAuthController.js";
import { RegisterController } from "../controller/RegisterController.js";
import { ResetPasswordController } from "../controller/ResetPasswordController.js";
import { VerifyOTPController } from "../controller/VerifyOTPController.js";

export const authRoutes = Router();

authRoutes.post("/register", RegisterController.register);
authRoutes.post("/verify-otp", VerifyOTPController.verify);
authRoutes.post("/complete-registration", CompleteRegistrationController.complete);
authRoutes.post("/login", LoginController.login);
authRoutes.post("/oauth", OAuthController.login);
authRoutes.post("/check-email", CheckEmailController.check);
authRoutes.post("/reset-password", ResetPasswordController.reset);
authRoutes.post("/complete-profile", CompleteProfileController.complete);
