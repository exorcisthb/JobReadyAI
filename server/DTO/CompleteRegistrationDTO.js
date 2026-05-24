import { ApiError } from "../utils/ApiError.js";
import { validatePassword } from "../utils/authUtils.js";

export class CompleteRegistrationDTO {
  constructor(body) {
    this.email = String(body.email ?? "").trim().toLowerCase();
    this.password = String(body.password ?? "");
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !emailRegex.test(this.email)) {
      throw new ApiError(400, "Email không hợp lệ.");
    }

    if (!validatePassword(this.password)) {
      throw new ApiError(400, "Mật khẩu cần có ít nhất 8 ký tự.");
    }
  }
}
