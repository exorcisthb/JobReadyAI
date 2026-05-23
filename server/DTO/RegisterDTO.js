import { ApiError } from "../utils/ApiError.js";

export class RegisterDTO {
  constructor(body) {
    this.phone = String(body.phone ?? "").trim();
  }

  validate() {
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!this.phone || !phoneRegex.test(this.phone)) {
      throw new ApiError(400, "Vui lòng nhập số điện thoại hợp lệ (9-15 chữ số).");
    }
  }
}
