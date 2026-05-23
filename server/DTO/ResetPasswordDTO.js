import { ApiError } from "../utils/ApiError.js";
import { normalizeEmail, validatePassword } from "../utils/authUtils.js";

export class ResetPasswordDTO {
  constructor(body) {
    this.email = normalizeEmail(body.email);
    this.password = String(body.password ?? "");
  }

  validate() {
    if (!this.email || !validatePassword(this.password)) {
      throw new ApiError(400, "Mật khẩu cần có ít nhất 8 ký tự.");
    }
  }
}
