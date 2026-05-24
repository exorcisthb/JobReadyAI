import { ApiError } from "../utils/ApiError.js";

export class VerifyOTPDTO {
  constructor(body) {
    this.email = String(body.email ?? "").trim().toLowerCase();
    this.otp = String(body.otp ?? "").trim();
  }

  validate() {
    if (!this.email || !this.otp) {
      throw new ApiError(400, "Vui lòng nhập email và mã OTP.");
    }

    if (!/^\d{6}$/.test(this.otp)) {
      throw new ApiError(400, "Mã OTP phải là 6 chữ số.");
    }
  }
}
