import { ApiError } from "../utils/ApiError.js";

export class EmailRegisterDTO {
  constructor({ email, password } = {}) {
    this.email = String(email ?? "").trim().toLowerCase();
    this.password = String(password ?? "");
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new ApiError(400, "Email không hợp lệ.");
    }
    if (this.password.length < 8) {
      throw new ApiError(400, "Mật khẩu phải có ít nhất 8 ký tự.");
    }
  }
}
