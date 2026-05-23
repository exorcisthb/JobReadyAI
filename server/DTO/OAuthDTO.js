import { ApiError } from "../utils/ApiError.js";
import { normalizeEmail } from "../utils/authUtils.js";

export class OAuthDTO {
  constructor(body) {
    this.email = normalizeEmail(body.email);
    this.name = String(body.name ?? "").trim() || this.email.split("@")[0];
    this.provider = body.provider === "facebook" ? "facebook" : "google";
    this.image = body.image ? String(body.image) : null;
    this.googleId = String(body.googleId ?? "").trim() || null;
  }

  validate() {
    if (!this.email) {
      throw new ApiError(400, "Không đọc được email từ nhà cung cấp đăng nhập.");
    }

    if (this.provider !== "google") {
      throw new ApiError(400, "Database hiện chỉ hỗ trợ OAuth Google.");
    }
  }
}
