import { ApiError } from "../utils/ApiError.js";

export class RegisterDTO {
  constructor(body) {
    this.email = String(body.email ?? "").trim().toLowerCase();
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      throw new ApiError(400, "Vui lòng nhập email hợp lệ.");
    }
  }
}
