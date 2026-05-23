import { ApiError } from "../utils/ApiError.js";
import { validatePassword } from "../utils/authUtils.js";

export class LoginDTO {
  constructor(body) {
    this.phone = String(body.phone ?? "").trim();
    this.password = String(body.password ?? "");
  }

  validate() {
    const phoneRegex = /^\+?[0-9]{9,15}$/;

    if (!this.phone || !phoneRegex.test(this.phone) || !validatePassword(this.password)) {
      throw new ApiError(400, "Số điện thoại hoặc mật khẩu không hợp lệ.");
    }
  }
}
