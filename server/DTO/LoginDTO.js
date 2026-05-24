import { ApiError } from "../utils/ApiError.js";
import { validatePassword } from "../utils/authUtils.js";

export class LoginDTO {
  constructor(body) {
    this.email = String(body.email ?? "").trim().toLowerCase();
    this.password = String(body.password ?? "");
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !emailRegex.test(this.email) || !validatePassword(this.password)) {
      throw new ApiError(400, "Email hoặc mật khẩu không hợp lệ.");
    }
  }
}
