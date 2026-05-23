import { ApiError } from "../utils/ApiError.js";
import { validatePassword } from "../utils/authUtils.js";

export class CompleteRegistrationDTO {
  constructor(body) {
    this.phone = String(body.phone ?? "").trim();
    this.password = String(body.password ?? "");
  }

  validate() {
    const phoneRegex = /^\+?[0-9]{9,15}$/;

    if (!this.phone || !phoneRegex.test(this.phone)) {
      throw new ApiError(400, "Số điện thoại không hợp lệ.");
    }

    if (!validatePassword(this.password)) {
      throw new ApiError(400, "Mật khẩu cần có ít nhất 8 ký tự.");
    }
  }
}
