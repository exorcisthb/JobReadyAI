import { ApiError } from "../utils/ApiError.js";
import { normalizeEmail } from "../utils/authUtils.js";

export class OAuthDTO {
  constructor(body) {
    this.email = normalizeEmail(body.email);
    this.name = String(body.name ?? "").trim() || (this.email ? this.email.split("@")[0] : "Facebook User");
    this.provider = body.provider === "facebook" ? "facebook" : "google";
    this.image = body.image ? String(body.image) : null;
    this.googleId = String(body.googleId ?? "").trim() || null;
    this.facebookId = String(body.facebookId ?? body.id ?? "").trim() || null;
    this.accessToken = String(body.accessToken ?? body.access_token ?? "").trim() || null;
  }

  validate() {
    if (this.provider === "google") {
      if (!this.email) {
        throw new ApiError(400, "Không đọc được email từ nhà cung cấp Google.");
      }
    } else if (this.provider === "facebook") {
      if (!this.facebookId && !this.email && !this.accessToken) {
        throw new ApiError(400, "Thiếu thông tin đăng nhập từ Facebook (facebookId/email/accessToken).");
      }
    } else {
      throw new ApiError(400, "Nhà cung cấp đăng nhập OAuth không hợp lệ.");
    }
  }
}
