import { ApiError } from "../utils/ApiError.js";

export class CompleteProfileDTO {
  constructor(body) {
    this.userId = String(body.userId ?? "").trim();
    this.fullName = String(body.fullName ?? "").trim();
    this.phone = String(body.phone ?? "").trim();
    this.jobTitle = String(body.jobTitle ?? "").trim();
    this.industry = String(body.industry ?? "").trim();
    this.experienceLevel = String(body.experienceLevel ?? "").trim();
    this.location = String(body.location ?? "").trim();
    this.skills = String(body.skills ?? "").trim();
    this.careerGoal = String(body.careerGoal ?? "").trim();
    this.referralCode = String(body.referralCode ?? "").trim();
  }

  validate() {
    if (!this.userId || !this.fullName || !this.industry || !this.jobTitle) {
      throw new ApiError(400, "Vui lòng nhập họ tên, ngành nghề và vị trí mong muốn.");
    }
  }
}
