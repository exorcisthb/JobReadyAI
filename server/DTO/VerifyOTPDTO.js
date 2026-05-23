import { ApiError } from "../utils/ApiError.js";

export class VerifyOTPDTO {
  constructor(body) {
    this.phone = String(body.phone ?? "").trim();
    this.otp = String(body.otp ?? "").trim();
  }

  validate() {
    if (!this.phone || !this.otp) {
      throw new ApiError(400, "Vui lòng nhập số điện thoại và mã OTP.");
    }

    if (!/^\d{6}$/.test(this.otp)) {
      throw new ApiError(400, "Mã OTP phải là 6 chữ số.");
    }
  }
}
